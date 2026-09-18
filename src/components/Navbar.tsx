import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, LogIn, User, Moon, Sun, BookMarked, BookOpen, Bookmark, MessageSquare } from 'lucide-react';
import { UserProfile, MainView } from '../types';
import { AppLogo } from './AppLogo';

interface NavbarProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenHistory: () => void;
  onNewChat: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  historyCount: number;
  currentView?: MainView;
  onNavigate?: (view: MainView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenHistory,
  onNewChat,
  darkMode,
  onToggleDarkMode,
  historyCount,
  currentView = 'chat',
  onNavigate,
}) => {
  return (
    <header className="w-full border-b border-[#ded5c2] dark:border-[#243932] bg-[#faf6ee]/95 dark:bg-[#111a18]/95 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Right side in RTL: Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div
            onClick={() => onNavigate?.('chat')}
            className="cursor-pointer"
            title="الرئيسية والمحراب"
          >
            <AppLogo
              size="sm"
              showSubtitle={true}
              subtitle="نحو، بلاغة، أدب وتعبير"
              className="flex-shrink-0"
            />
          </div>

          {/* Central Navigation Links */}
          {onNavigate && (
            <nav className="hidden md:flex items-center gap-1 bg-[#ede4d2]/70 dark:bg-[#182a25] p-1 rounded-2xl border border-[#ded4bf] dark:border-[#263c35]">
              <button
                onClick={() => onNavigate('chat')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'chat'
                    ? 'bg-[#0d3a33] text-white dark:bg-[#1a554a] shadow-2xs'
                    : 'text-[#41554e] dark:text-[#a7bdb5] hover:text-[#0d3a33] dark:hover:text-[#e4efe9]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>المحراب</span>
              </button>

              <button
                onClick={() => onNavigate('articles')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'articles'
                    ? 'bg-[#0d3a33] text-white dark:bg-[#1a554a] shadow-2xs'
                    : 'text-[#41554e] dark:text-[#a7bdb5] hover:text-[#0d3a33] dark:hover:text-[#e4efe9]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>المقالات اللغوية</span>
              </button>

              <button
                onClick={() => onNavigate('glossary')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'glossary'
                    ? 'bg-[#0d3a33] text-white dark:bg-[#1a554a] shadow-2xs'
                    : 'text-[#41554e] dark:text-[#a7bdb5] hover:text-[#0d3a33] dark:hover:text-[#e4efe9]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>معجمي الخاص</span>
              </button>
            </nav>
          )}
        </div>

        {/* Left side in RTL: Action Buttons matching ه.PNG & نم.PNG with subtle animations */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Quick Links for Articles & Glossary */}
          {onNavigate && (
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => onNavigate('articles')}
                title="المقالات"
                className={`p-2 rounded-xl border text-xs cursor-pointer ${
                  currentView === 'articles'
                    ? 'bg-[#0d3a33] text-white border-[#0d3a33]'
                    : 'border-[#ded5c2] dark:border-[#2b3e38] text-[#334640] dark:text-[#c4d6d0]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('glossary')}
                title="معجمي الخاص"
                className={`p-2 rounded-xl border text-xs cursor-pointer ${
                  currentView === 'glossary'
                    ? 'bg-[#0d3a33] text-white border-[#0d3a33]'
                    : 'border-[#ded5c2] dark:border-[#2b3e38] text-[#334640] dark:text-[#c4d6d0]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {/* Animated Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92, rotate: 15 }}
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            title={darkMode ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border border-[#ded5c2] dark:border-[#2b3e38] text-[#475b54] dark:text-[#b0c4bd] hover:bg-[#ede5d6] dark:hover:bg-[#1a2925] shadow-2xs transition-colors duration-200 cursor-pointer overflow-hidden"
            aria-label="تبديل الوضع"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={darkMode ? 'dark-sun' : 'light-moon'}
                initial={{ scale: 0.4, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.4, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="flex items-center justify-center"
              >
                {darkMode ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-[#0d3a33]" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Animated Library / History Trigger */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.92 }}
            id="history-drawer-btn"
            onClick={onOpenHistory}
            className="h-8.5 sm:h-9 px-2.5 sm:px-3 flex items-center justify-center gap-1.5 text-xs font-medium rounded-xl border border-[#ded5c2] dark:border-[#2b3e38] text-[#334640] dark:text-[#c4d6d0] hover:bg-[#ede5d6] dark:hover:bg-[#1a2925] active:scale-95 transition-all relative cursor-pointer"
            title="المكتبة والمحفوظات"
            aria-label="المكتبة"
          >
            <motion.div
              whileHover={{ rotate: [-5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <BookMarked className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7] flex-shrink-0" />
            </motion.div>
            <span className="hidden sm:inline">المكتبة</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold rounded-full bg-[#0d3a33] text-white dark:bg-[#6ee7b7] dark:text-[#0b2721]">
                {historyCount}
              </span>
            )}
          </motion.button>

          {/* New Chat Button matching ه.PNG (+ محادثة جديدة) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.94 }}
            id="new-chat-btn"
            onClick={onNewChat}
            className="h-8.5 sm:h-9 px-2.5 sm:px-3 flex items-center justify-center gap-1 text-xs font-semibold rounded-xl bg-[#0d3a33] hover:bg-[#144940] text-white dark:bg-[#1a554a] dark:hover:bg-[#236b5d] active:scale-95 shadow-2xs transition-all cursor-pointer"
            title="بدء محادثة جديدة"
            aria-label="محادثة جديدة"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline">محادثة جديدة</span>
          </motion.button>

          {/* Auth Button */}
          <button
            id="auth-modal-btn"
            onClick={onOpenAuth}
            className="h-8.5 sm:h-9 px-2.5 sm:px-3 flex items-center justify-center gap-1.5 text-xs font-medium rounded-xl border border-[#ded5c2] dark:border-[#2b3e38] text-[#334640] dark:text-[#c4d6d0] hover:bg-[#ede5d6] dark:hover:bg-[#1a2925] active:scale-95 transition-all cursor-pointer flex-shrink-0"
            aria-label="الحساب"
          >
            {user ? (
              <>
                <span className="text-xs leading-none">{user.avatar}</span>
                <span className="max-w-[70px] truncate hidden md:inline text-xs">{user.name}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">دخول</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
