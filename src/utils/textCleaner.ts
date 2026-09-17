/**
 * Text cleaner to remove weird symbols, unformatted characters,
 * broken markdown artifacts, HTML tags (<br>), or strange unicode characters from answers.
 */
export function cleanArabicAnswer(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // 1. Remove unicode replacement characters or invisible junk
  text = text.replace(/[\uFFFD\uFEFF\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

  // 2. Convert <br>, <br/>, <br > to newlines
  text = text.replace(/<\s*br\s*\/?\s*>/gi, '\n');

  // 3. Remove all leftover raw HTML tags (e.g., <span>, <p>, </div>, etc.)
  text = text.replace(/<\/?[a-zA-Z][^>]*>/g, '');

  // 4. Normalize repeated asterisks (e.g., ****word**** -> **word**)
  text = text.replace(/\*{3,}/g, '**');

  // 5. Remove stray code fence wrappers if the entire response was wrapped in ```markdown ... ```
  text = text.replace(/^```markdown\s*/i, '').replace(/^```\s*/, '');
  text = text.replace(/```\s*$/, '');

  // 6. Fix malformed table lines and stray separator rows (e.g. "| :--- | :--- | |")
  text = text.replace(/\|\s*:\s*-+\s*\|\s*:\s*-+\s*\|\s*\|\s*/g, '| :--- | :--- |\n');
  text = text.replace(/\|\s*\|\s*$/gm, '|');

  // 7. Remove weird random symbols like §, ¤, █, ▓, ▒, ★, ✦, ▲, ▼, etc.
  text = text.replace(/[§¤█▓▒▲▼◄►◆◇★✦]/g, '');

  // 8. Clean excessive repeating dashes or tildes
  text = text.replace(/~{2,}/g, '');
  text = text.replace(/_{4,}/g, '___');

  // 9. Fix excessive consecutive blank lines
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

