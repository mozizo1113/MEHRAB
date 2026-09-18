import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { motion } from 'motion/react';
import {
  Copy,
  Check,
  Printer,
  Star,
  Sparkles,
  BookOpen,
  Minimize2,
  ScrollText,
  Feather,
  FileDown,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { SmartTable } from './SmartTable';
import { cleanArabicAnswer } from '../utils/textCleaner';
import { exportAnalysisToPDF } from '../utils/exportPdf';

interface ResultCardProps {
  message: ChatMessage;
  onToggleStar: (id: string) => void;
  isReadingMode?: boolean;
  onToggleReadingMode?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  message,
  onToggleStar,
  isReadingMode = false,
  onToggleReadingMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedToGlossary, setSavedToGlossary] = useState(false);

  // Check if this message was already saved to glossary
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mihrab_personal_glossary_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.some((item: any) => item.id === `msg-${message.id}`)) {
          setSavedToGlossary(true);
        }
      }
    } catch {
      // ignore
    }
  }, [message.id]);

  // Allow Escape key to exit reading mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isReadingMode && onToggleReadingMode) {
        onToggleReadingMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReadingMode, onToggleReadingMode]);

  const cleanedAnswer = cleanArabicAnswer(message.answer);

  const handleSaveToGlossary = () => {
    try {
      const stored = localStorage.getItem('mihrab_personal_glossary_v1');
      let currentGlossary: any[] = stored ? JSON.parse(stored) : [];

      if (savedToGlossary) {
        // Remove
        currentGlossary = currentGlossary.filter((t) => t.id !== `msg-${message.id}`);
        localStorage.setItem('mihrab_personal_glossary_v1', JSON.stringify(currentGlossary));
        setSavedToGlossary(false);
        return;
      }

      // Extract sensible term name
      let termName = message.question.replace(/^(اشرح|معنى|ما معنى كلمة|ما إعراب|استخرج|بين|وضح)\s*/gi, '').trim();
      termName = termName.replace(/^[«"']|[»"']$/g, '').trim();
      if (!termName || termName.length > 50) {
        // Fallback to first 4 words
        termName = message.question.split(' ').slice(0, 4).join(' ');
      }

      // Categorize
      let cat: 'grammar' | 'rhetoric' | 'vocabulary' | 'literature' = 'grammar';
      if (message.mode === 'rhetoric') cat = 'rhetoric';
      else if (message.mode === 'literature') cat = 'literature';
      else if (message.mode === 'grammar_rhetoric') cat = 'grammar';

      // Summary definition: first 250 chars of answer
      const plainAnswer = cleanedAnswer.replace(/[#*`_]/g, '').trim();
      const def = plainAnswer.slice(0, 300) + (plainAnswer.length > 300 ? '...' : '');

      const newEntry = {
        id: `msg-${message.id}`,
        term: termName,
        category: cat,
        definition: def,
        example: message.question !== termName ? `سياق السؤال: ${message.question}` : undefined,
        createdAt: new Date().toISOString(),
      };

      currentGlossary = [newEntry, ...currentGlossary];
      localStorage.setItem('mihrab_personal_glossary_v1', JSON.stringify(currentGlossary));
      setSavedToGlossary(true);
    } catch (e) {
      console.error('Failed to save to glossary', e);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `السؤال: ${message.question}\n\nالإجابة:\n${cleanedAnswer}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getModeBadge = () => {
    switch (message.mode) {
      case 'grammar':
        return {
          label: 'نحو وإعراب تفصيلي',
          icon: BookOpen,
          color: 'bg-emerald-900/10 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-300',
        };
      case 'rhetoric':
        return {
          label: 'علم البلاغة والبيان',
          icon: Sparkles,
          color: 'bg-purple-900/10 text-purple-900 dark:bg-purple-400/10 dark:text-purple-300',
        };
      case 'grammar_rhetoric':
        return {
          label: 'نحو وبلاغة وإعراب',
          icon: BookOpen,
          color: 'bg-emerald-900/10 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-300',
        };
      case 'literature':
        return {
          label: 'أدب ونصوص وتذوق',
          icon: ScrollText,
          color: 'bg-amber-900/10 text-amber-900 dark:bg-amber-400/10 dark:text-amber-300',
        };
      case 'composition':
        return {
          label: 'موضوع تعبير وبلاغة',
          icon: Feather,
          color: 'bg-teal-900/10 text-teal-900 dark:bg-teal-400/10 dark:text-teal-300',
        };
      default:
        return {
          label: 'دراسات عربية',
          icon: Sparkles,
          color: 'bg-stone-900/10 text-stone-900 dark:bg-stone-400/10 dark:text-stone-300',
        };
    }
  };

  const badge = getModeBadge();
  const BadgeIcon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`w-full mx-auto px-2 sm:px-4 my-3 sm:my-5 transition-all duration-300 ${
        isReadingMode ? 'max-w-5xl' : 'max-w-4xl'
      }`}
    >
      {/* Unified AI Answer Card matching 66.PNG, 88.PNG, and 77.PNG with Reading Mode support */}
      <div
        className={`rounded-3xl border transition-colors overflow-hidden ${
          isReadingMode
            ? 'p-6 sm:p-11 lg:p-14 bg-[#fdfbf6] dark:bg-[#111c19] border-[#e2d6c1] dark:border-[#2b4138] shadow-md'
            : 'p-5 sm:p-9 bg-[#fdfbf7] dark:bg-[#14211e] border-[#ece3d3] dark:border-[#273d36] shadow-xs'
        }`}
      >
        {/* Top Header Row: Action tools on top-left, Question pill on top-right */}
        {/* Generous spacing (mb-8 sm:mb-9 pb-4 sm:pb-5) ensuring 2 full text lines space before the answer */}
        <div className="flex flex-wrap-reverse items-center justify-between gap-3 mb-8 sm:mb-9 pb-4 sm:pb-5 border-b border-[#ece2d1] dark:border-[#1e302b]">
          {/* Action buttons (Reading Mode, Export PDF, copy, star, print) */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {/* Reading Mode Toggle Button */}
            {onToggleReadingMode && (
              <button
                id={`reading-mode-btn-${message.id}`}
                onClick={onToggleReadingMode}
                title={
                  isReadingMode
                    ? 'الخروج من وضع القراءة والعودة للمظهر العادي (Esc)'
                    : 'تفعيل وضع القراءة وتوسيع العرض لتحسين تباعد الأسطر وحجم الخط'
                }
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 shadow-2xs ${
                  isReadingMode
                    ? 'bg-[#0d3a33] text-white dark:bg-[#204e43] border-[#0d3a33] dark:border-[#386b5e]'
                    : 'border-[#ded5c2] dark:border-[#2b4139] bg-[#f4ede0] dark:bg-[#1b2d27] text-[#0d3a33] dark:text-[#6ee7b7] hover:bg-[#eae0cf] dark:hover:bg-[#233a32]'
                }`}
              >
                {isReadingMode ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>خروج من القراءة</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
                    <span>وضع القراءة</span>
                  </>
                )}
              </button>
            )}

            {/* Save to Personal Glossary */}
            <button
              id={`glossary-btn-${message.id}`}
              onClick={handleSaveToGlossary}
              title={
                savedToGlossary
                  ? 'تم الحفظ في معجمك الخاص (اضغط للإلغاء)'
                  : 'حفظ هذا المصطلح أو الإعراب في معجمك الخاص للمراجعة لاحقاً'
              }
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer active:scale-95 shadow-2xs ${
                savedToGlossary
                  ? 'bg-amber-500/15 border-amber-400 text-amber-800 dark:text-amber-300 font-bold'
                  : 'border-[#ded5c2] dark:border-[#2b4139] bg-[#f4ede0] dark:bg-[#1b2d27] text-[#0d3a33] dark:text-[#6ee7b7] hover:bg-[#eae0cf] dark:hover:bg-[#233a32]'
              }`}
            >
              {savedToGlossary ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                  <span>محفوظ في معجمي</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
                  <span>حفظ في معجمي</span>
                </>
              )}
            </button>

            {/* Export as PDF button */}
            <button
              id={`export-pdf-btn-${message.id}`}
              onClick={() => exportAnalysisToPDF(message)}
              title="تصدير كـ PDF لحفظ الإعرابات ومواطن الجمال"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-[#ded5c2] dark:border-[#2b4139] bg-[#f4ede0] dark:bg-[#1b2d27] text-[#0d3a33] dark:text-[#6ee7b7] hover:bg-[#eae0cf] dark:hover:bg-[#233a32] active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
              <span>تصدير كـ PDF</span>
            </button>

            {/* Copy button */}
            <button
              id={`copy-btn-${message.id}`}
              onClick={handleCopy}
              title="نسخ الإجابة"
              className="p-2 rounded-xl text-xs font-medium border border-[#ded5c2] dark:border-[#2b4139] text-[#475a53] dark:text-[#b4c8c1] hover:bg-[#eee6d6] dark:hover:bg-[#1c2c27] active:scale-95 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Star favorite */}
            <button
              id={`star-btn-${message.id}`}
              onClick={() => onToggleStar(message.id)}
              title={message.starred ? 'إزالة من المحفوظات' : 'حفظ في المفضلة'}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors active:scale-95 cursor-pointer ${
                message.starred
                  ? 'bg-amber-400/15 border-amber-400 text-amber-600 dark:text-amber-300'
                  : 'border-[#ded5c2] dark:border-[#2b4139] text-[#475a53] dark:text-[#b4c8c1] hover:bg-[#eee6d6] dark:hover:bg-[#1c2c27]'
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  message.starred ? 'fill-amber-400 text-amber-500' : ''
                }`}
              />
            </button>

            {/* Print button */}
            <button
              id={`print-btn-${message.id}`}
              onClick={handlePrint}
              title="طباعة الإجابة"
              className="hidden sm:inline-flex p-2 rounded-xl text-xs font-medium border border-[#ded5c2] dark:border-[#2b4139] text-[#475a53] dark:text-[#b4c8c1] hover:bg-[#eee6d6] dark:hover:bg-[#1c2c27] active:scale-95 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          {/* User Question Pill on Top-Right */}
          {message.question && (
            <div className="flex-1 flex justify-end">
              <span className="inline-block bg-[#ede8df] dark:bg-[#1f312b] text-[#2c3e38] dark:text-[#d3e5df] text-xs sm:text-sm font-medium px-4 py-2 rounded-2xl max-w-xl text-right leading-relaxed shadow-2xs">
                {message.question}
              </span>
            </div>
          )}
        </div>

        {/* Attached image if any */}
        {message.image && (
          <div className="mb-6 flex justify-end">
            <a
              href={message.image.dataUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block p-1 bg-[#ede8df] dark:bg-[#1f312b] rounded-2xl border border-[#ded5c3] dark:border-[#2b4038]"
            >
              <img
                src={message.image.dataUrl}
                alt="سؤال مرفق"
                className="max-h-44 sm:max-h-56 rounded-xl object-contain hover:opacity-95 transition-opacity"
              />
            </a>
          </div>
        )}

        {/* Formatted Markdown Content with SmartTable integration and customized divider line spacing */}
        <div
          className={`prose-arabic ${
            isReadingMode ? 'reading-mode-active' : ''
          } text-[#182622] dark:text-[#e4efe9] text-sm sm:text-base leading-relaxed`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              table: (props) => <SmartTable {...props} />,
              hr: () => (
                <div className="my-8 sm:my-10" role="separator">
                  <hr className="border-t border-[#e2d8c7] dark:border-[#273d36]" />
                  {/* Two full lines equivalent space beneath the separator */}
                  <div className="h-4 sm:h-5" aria-hidden="true" />
                </div>
              ),
            }}
          >
            {cleanedAnswer}
          </ReactMarkdown>
        </div>

        {/* Bottom banner when Reading Mode is enabled */}
        {isReadingMode && onToggleReadingMode && (
          <div className="mt-12 pt-6 border-t border-[#ede3d2] dark:border-[#20342e] flex flex-wrap items-center justify-between gap-3 text-xs text-[#60736c] dark:text-[#8ea49c]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0d3a33] dark:text-[#6ee7b7]" />
              <span>أنت الآن في «وضع القراءة» المُوسّع مع تحسين تباعد الأسطر وحجم الخط للقراءة المطولة.</span>
            </div>
            <button
              onClick={onToggleReadingMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d3a33] text-white hover:bg-[#154b41] dark:bg-[#204e43] dark:hover:bg-[#285f52] text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>الخروج من وضع القراءة (Esc)</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
