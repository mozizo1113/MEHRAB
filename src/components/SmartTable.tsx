import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, Copy, Check, Download, Sparkles, MoveHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SmartTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
}

export const SmartTable: React.FC<SmartTableProps> = ({ children, ...props }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [canScrollHorizontally, setCanScrollHorizontally] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Check if horizontal scroll is possible
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const hasScroll = el.scrollWidth > el.clientWidth + 5;
    setCanScrollHorizontally(hasScroll);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  // Handle ESC key to close fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Copy table content as formatted text
  const handleCopyTable = () => {
    if (!tableRef.current) return;
    const rows = Array.from(tableRef.current.querySelectorAll('tr'));
    const textRows = rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      return cells.map((cell) => cell.textContent?.trim() || '').join(' | ');
    });
    navigator.clipboard.writeText(textRows.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download table content
  const handleDownloadTable = () => {
    if (!tableRef.current) return;
    const rows = Array.from(tableRef.current.querySelectorAll('tr'));
    const textRows = rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      return cells.map((cell) => `"${(cell.textContent?.trim() || '').replace(/"/g, '""')}"`).join(',');
    });
    const blob = new Blob(['\uFEFF' + textRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'جدول_الإعراب_محراب_البيان.csv';
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="my-5 relative rounded-2xl border border-[#ded5c2] dark:border-[#2b4139] bg-[#faf6ee] dark:bg-[#15231f] p-3 sm:p-4 shadow-2xs">
      {/* 3 Action Buttons on Top-Left exactly matching 77.PNG: [ ⛶ ] [ ⤓ ] [ 📋 ] */}
      <div className="flex items-center gap-1 mb-2 ltr:justify-end rtl:justify-start">
        {/* Fullscreen button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          title="تكبير الجدول لملء الشاشة"
          className="p-1.5 rounded-lg text-[#556962] dark:text-[#9bb3ab] hover:text-[#0d3a33] dark:hover:text-white hover:bg-[#ede5d6] dark:hover:bg-[#1e312b] transition-colors"
        >
          <Maximize2 className="w-4 h-4 stroke-[1.8]" />
        </button>

        {/* Download button */}
        <button
          type="button"
          onClick={handleDownloadTable}
          title="تنزيل الجدول (CSV)"
          className="p-1.5 rounded-lg text-[#556962] dark:text-[#9bb3ab] hover:text-[#0d3a33] dark:hover:text-white hover:bg-[#ede5d6] dark:hover:bg-[#1e312b] transition-colors"
        >
          {downloaded ? (
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2]" />
          ) : (
            <Download className="w-4 h-4 stroke-[1.8]" />
          )}
        </button>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopyTable}
          title="نسخ محتوى الجدول"
          className="p-1.5 rounded-lg text-[#556962] dark:text-[#9bb3ab] hover:text-[#0d3a33] dark:hover:text-white hover:bg-[#ede5d6] dark:hover:bg-[#1e312b] transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2]" />
          ) : (
            <Copy className="w-4 h-4 stroke-[1.8]" />
          )}
        </button>

        {/* Mobile scroll hint if needed */}
        {canScrollHorizontally && (
          <span className="inline-flex items-center gap-1 text-[11px] text-[#71857e] dark:text-[#8ea59d] mr-2 sm:hidden">
            <MoveHorizontal className="w-3 h-3 text-[#0d3a33] dark:text-[#6ee7b7]" />
            <span>مرر أفقياً</span>
          </span>
        )}
      </div>

      {/* Main Table Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="w-full overflow-x-auto overflow-y-hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <table ref={tableRef} className="w-full min-w-[480px]" {...props}>
          {children}
        </table>
      </div>

      {/* Fullscreen Modal View */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col p-2 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full h-full max-w-6xl mx-auto bg-[#fbf8f1] dark:bg-[#14221f] rounded-2xl sm:rounded-3xl border border-[#d8cdb8] dark:border-[#2c433b] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Fullscreen Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#efe7d8] dark:bg-[#1a2d27] border-b border-[#ded3be] dark:border-[#283e37]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#0f3e36] text-white dark:bg-[#6ee7b7] dark:text-[#0b2823]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-amiri text-[#172722] dark:text-[#e4efe9]">
                      عرض الجدول التفاعلي بملء الشاشة
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#596d66] dark:text-[#8ea59d]">
                      تمرير أفقي وعمودي سلس وسهولة قراءة فائقة على الهواتف والأجهزة
                    </p>
                  </div>
                </div>

                {/* Header Controls */}
                <div className="flex items-center gap-2">
                  {/* Zoom controls */}
                  <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-xl bg-[#e3d9c5] dark:bg-[#15231f] border border-[#d0c4ad] dark:border-[#253933] text-xs">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                      className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 font-bold"
                      title="تصغير الخط"
                    >
                      -
                    </button>
                    <span className="font-mono px-1">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(160, z + 10))}
                      className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 font-bold"
                      title="تكبير الخط"
                    >
                      +
                    </button>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={handleCopyTable}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#d5cabb] dark:border-[#2f4840] bg-[#fbf8f1] dark:bg-[#162622] text-[#2c3f39] dark:text-[#c4dbd3] text-xs font-medium hover:bg-[#ede5d6] transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الجدول</span>
                      </>
                    )}
                  </button>

                  {/* Close Fullscreen */}
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 rounded-xl bg-[#0f3e36] hover:bg-[#175247] text-white dark:bg-[#1b554b] dark:hover:bg-[#256f62] transition-colors shadow-2xs"
                    title="الخروج من ملء الشاشة (ESC)"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fullscreen Table Body */}
              <div
                className="flex-1 overflow-auto p-4 sm:p-6"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div
                  className="w-full flex justify-center transition-all duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top right' }}
                >
                  <table
                    className="w-full border-collapse border border-[#ded3be] dark:border-[#2a423a] shadow-sm rounded-xl overflow-hidden font-amiri text-base sm:text-lg"
                    {...props}
                  >
                    {children}
                  </table>
                </div>
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 bg-[#efe7d8] dark:bg-[#172823] border-t border-[#ded3be] dark:border-[#243a33] text-center text-xs text-[#637770] dark:text-[#8ea59d]">
                اضغط مفتاح <kbd className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono">ESC</kbd> أو زر التصغير للعودة إلى القراءة العادية
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
