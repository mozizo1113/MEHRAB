/**
 * Utility to export linguistic analysis, parsing tables, and rhetoric breakdowns as a high-fidelity PDF document.
 * Uses native browser PDF rendering with embedded Arabic typography (Cairo, Alexandria, Amiri)
 * ensuring 100% correct ligatures, tashkeel (diacritics), and right-to-left layout.
 */

import { ChatMessage } from '../types';

export function exportAnalysisToPDF(message: ChatMessage): void {
  const modeLabels: Record<string, string> = {
    grammar: 'قسم النحو والصرف والإعراب',
    rhetoric: 'علم البلاغة ومواطن البيان والجمال',
    grammar_rhetoric: 'نحو وبلاغة وإعراب تفصيلي',
    literature: 'أدب ونصوص وشرح بلاغي',
    composition: 'إنشاء وموضوعات تعبير',
  };

  const modeTitle = modeLabels[message.mode] || 'تحليل لغوي ودراسات عربية';
  const currentDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Convert markdown to clean HTML for print
  const formattedHtml = parseMarkdownToPrintHtml(message.answer);

  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('يرجى السماح بفتح النوافذ المنبثقة لتحميل وطباعة ملف الـ PDF');
    return;
  }

  const printDocument = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>محراب البيان - ${escapeHtml(message.question.slice(0, 40))}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Cairo', 'Alexandria', sans-serif;
      direction: rtl;
      text-align: right;
      color: #1a2924;
      background-color: #ffffff;
      padding: 10px;
      line-height: 1.8;
      font-size: 13pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Academic Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0d3a33;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-family: 'Amiri', serif;
      font-size: 24pt;
      font-weight: bold;
      color: #0d3a33;
      line-height: 1.2;
    }
    .brand-sub {
      font-size: 9pt;
      color: #61736c;
      font-weight: 500;
    }
    .meta-info {
      text-align: left;
      font-size: 9pt;
      color: #4a5c55;
    }
    .badge {
      display: inline-block;
      background-color: #eaf3f0;
      color: #0d3a33;
      padding: 3px 10px;
      border-radius: 6px;
      font-weight: 600;
      margin-bottom: 4px;
      border: 1px solid #c2ded7;
    }

    /* Question Box */
    .question-card {
      background-color: #f7f4ee;
      border: 1px solid #e2d9c8;
      border-right: 5px solid #0d3a33;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .question-label {
      font-size: 10pt;
      font-weight: bold;
      color: #0d3a33;
      margin-bottom: 4px;
    }
    .question-text {
      font-size: 13pt;
      font-weight: 600;
      color: #172622;
      line-height: 1.6;
    }

    /* Answer Content */
    .content h1, .content h2 {
      font-family: 'Alexandria', 'Amiri', serif;
      color: #0d3a33;
      font-size: 16pt;
      margin-top: 18px;
      margin-bottom: 10px;
      border-bottom: 1px solid #e5dcce;
      padding-bottom: 4px;
      page-break-after: avoid;
    }
    .content h3 {
      font-family: 'Alexandria', sans-serif;
      color: #164e43;
      font-size: 13pt;
      margin-top: 14px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    .content p {
      margin-bottom: 12px;
      line-height: 1.85;
      text-align: justify;
    }
    .content strong {
      color: #092621;
      font-weight: bold;
    }
    .content ul, .content ol {
      margin-right: 24px;
      margin-bottom: 14px;
    }
    .content li {
      margin-bottom: 6px;
      line-height: 1.7;
    }

    /* Tables (Grammar Breakdown) */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 11pt;
      page-break-inside: avoid;
      background-color: #ffffff;
      border: 1px solid #dcd3c1;
    }
    th {
      background-color: #f2eee5;
      color: #0d3a33;
      font-weight: bold;
      padding: 8px 12px;
      border: 1px solid #dcd3c1;
      text-align: right;
    }
    td {
      padding: 8px 12px;
      border: 1px solid #e8e2d5;
      vertical-align: top;
      line-height: 1.6;
    }
    tr:nth-child(even) td {
      background-color: #fbf9f4;
    }

    /* Quotes and Hadith/Poetry */
    blockquote {
      border-right: 4px solid #b89345;
      background-color: #fdfaf3;
      padding: 8px 14px;
      margin: 14px 0;
      border-radius: 4px;
      font-family: 'Amiri', serif;
      font-size: 13pt;
    }

    /* Footer */
    .footer {
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #ded6c6;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: #72847d;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">محراب البيان</div>
      <div class="brand-sub">منصة حل وشرح النحو، البلاغة، الأدب، والتعبير</div>
    </div>
    <div class="meta-info">
      <div class="badge">${modeTitle}</div>
      <div>التاريخ: ${currentDate}</div>
    </div>
  </div>

  <div class="question-card">
    <div class="question-label">السؤال اللغوي:</div>
    <div class="question-text">${escapeHtml(message.question)}</div>
  </div>

  ${message.image ? `<div style="text-align: center; margin-bottom: 16px;"><img src="${message.image.dataUrl}" style="max-height: 180px; border-radius: 8px; border: 1px solid #ccc;" alt="صورة السؤال"></div>` : ''}

  <div class="content">
    ${formattedHtml}
  </div>

  <div class="footer">
    <div>تم استخراج هذا التقرير التعليمي آلياً عبر محراب البيان</div>
    <div>حقوق المحتوى محفوظة © ${new Date().getFullYear()}</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(printDocument);
  printWindow.document.close();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Basic lightweight Markdown to clean HTML parser designed specifically
 * for Arabic grammar tables, bold words, headings, bullet lists, and quotes.
 */
function parseMarkdownToPrintHtml(md: string): string {
  if (!md) return '';

  const lines = md.split('\n');
  const out: string[] = [];
  let inTable = false;
  let tableHeaderParsed = false;
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Table check
    if (line.startsWith('|') && line.endsWith('|')) {
      // Check if it's separator row |---|---|
      if (/^\|[\s\-:|]+\|$/.test(line)) {
        continue;
      }

      if (!inTable) {
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        out.push('<table>');
        inTable = true;
        tableHeaderParsed = false;
      }

      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => formatInlineMarkdown(c.trim()));

      if (!tableHeaderParsed) {
        out.push('<thead><tr>' + cells.map((c) => `<th>${c}</th>`).join('') + '</tr></thead><tbody>');
        tableHeaderParsed = true;
      } else {
        out.push('<tr>' + cells.map((c) => `<td>${c}</td>`).join('') + '</tr>');
      }
      continue;
    } else if (inTable) {
      out.push('</tbody></table>');
      inTable = false;
    }

    if (!line) {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push(`<h3>${formatInlineMarkdown(line.slice(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push(`<h2>${formatInlineMarkdown(line.slice(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push(`<h1>${formatInlineMarkdown(line.slice(2))}</h1>`);
    } else if (line.startsWith('> ')) {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push(`<blockquote>${formatInlineMarkdown(line.slice(2))}</blockquote>`);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${formatInlineMarkdown(line.slice(2))}</li>`);
    } else {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      out.push(`<p>${formatInlineMarkdown(line)}</p>`);
    }
  }

  if (inTable) out.push('</tbody></table>');
  if (inList) out.push('</ul>');

  return out.join('\n');
}

function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:#eee;padding:1px 4px;border-radius:3px;">$1</code>');
}
