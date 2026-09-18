import React from 'react';
import { BookOpen, Bookmark, ShieldCheck, MessageSquare, Sparkles, Compass } from 'lucide-react';
import { MainView } from '../types';
import { AppLogo } from './AppLogo';

interface FooterProps {
  onNavigate: (view: MainView) => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTerms }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto pt-8 pb-7 bg-[#f6eee0]/80 dark:bg-[#0f1917]/90 border-t border-[#dfd3bd] dark:border-[#223630] font-alexandria text-right transition-colors backdrop-blur-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Upper Row: Brand & Quick Links */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-[#e5d9c2] dark:border-[#1e312a]">
          {/* Brand Logo & Tagline (Real AppLogo with intricate arabesque quill, not just letter M) */}
          <div
            onClick={() => {
              onNavigate('chat');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer group flex-shrink-0"
            title="العودة إلى محراب البيان"
          >
            <AppLogo
              size="sm"
              showSubtitle={true}
              subtitle="المعلم والمدقق اللغوي والنحوي الذكي"
              className="group-hover:opacity-90 transition-opacity"
            />
          </div>

          {/* Styled Quick Links Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <button
              id="footer-nav-chat-btn"
              onClick={() => {
                onNavigate('chat');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded3bd] dark:border-[#273d36] bg-[#faf6ed] dark:bg-[#14231f] hover:bg-[#ede1ca] dark:hover:bg-[#1d332c] text-[#243731] dark:text-[#c7dad2] font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
              <span>المحراب</span>
            </button>

            <button
              id="footer-nav-articles-btn"
              onClick={() => {
                onNavigate('articles');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded3bd] dark:border-[#273d36] bg-[#faf6ed] dark:bg-[#14231f] hover:bg-[#ede1ca] dark:hover:bg-[#1d332c] text-[#243731] dark:text-[#c7dad2] font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
              <span>المقالات اللغوية</span>
            </button>

            <button
              id="footer-nav-glossary-btn"
              onClick={() => {
                onNavigate('glossary');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded3bd] dark:border-[#273d36] bg-[#faf6ed] dark:bg-[#14231f] hover:bg-[#ede1ca] dark:hover:bg-[#1d332c] text-[#243731] dark:text-[#c7dad2] font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
              <span>معجمي الخاص</span>
            </button>

            <button
              id="footer-nav-terms-btn"
              onClick={onOpenTerms}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded3bd] dark:border-[#273d36] bg-[#faf6ed] dark:bg-[#14231f] hover:bg-[#ede1ca] dark:hover:bg-[#1d332c] text-[#243731] dark:text-[#c7dad2] font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
              <span>الشروط والأحكام وميثاق الاستخدام</span>
            </button>
          </div>
        </div>

        {/* Lower Row: Copyright Notice & Scholarly Assurance */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-[#63776f] dark:text-[#7d938b]">
          <div className="flex items-center gap-1.5">
            <p>
              جميع الحقوق محفوظة © {currentYear} محراب البيان العربي. صُمّم بعناية لخدمة لغة القرآن وأهل الضاد.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10.5px]">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ebdcc5]/60 dark:bg-[#172722] text-[#344641] dark:text-[#a5b9b2] border border-[#ded3be] dark:border-[#22352f]">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span>معتمد وفق ضوابط النحو والبلاغة</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
