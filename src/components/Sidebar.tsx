import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  Feather,
  ScrollText,
  Plus,
  Trash2,
  Star,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage, AppMode } from '../types';
import { AppLogo } from './AppLogo';

interface SidebarProps {
  messages: ChatMessage[];
  activeMessageId: string | null;
  onSelectMessage: (msg: ChatMessage) => void;
  onNewChat: () => void;
  onDeleteMessage: (id: string) => void;
  onToggleStar: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface CategorySection {
  id: AppMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategorySection[] = [
  { id: 'grammar', label: 'نحو وصرف', icon: BookOpen },
  { id: 'rhetoric', label: 'بلاغة', icon: Sparkles },
  { id: 'composition', label: 'تعبير', icon: Feather },
  { id: 'literature', label: 'أدب ونصوص', icon: ScrollText },
];

export const Sidebar: React.FC<SidebarProps> = ({
  messages,
  activeMessageId,
  onSelectMessage,
  onNewChat,
  onDeleteMessage,
  onToggleStar,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Filter messages by category & search query
  const getMessagesForCategory = (catId: AppMode) => {
    return messages.filter((m) => {
      const matchCategory =
        m.mode === catId ||
        (catId === 'grammar' && m.mode === 'grammar_rhetoric');
      if (!matchCategory) return false;
      if (!searchQuery.trim()) return true;
      return (
        m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const content = (
    <div className="h-full flex flex-col bg-[#faf6ee] dark:bg-[#14221e] border-l border-[#ded5c2] dark:border-[#263c35] select-none text-right">
      {/* Top Header matching تت.PNG & ه.PNG */}
      <div className="p-3 sm:p-3.5 border-b border-[#ebdfcb] dark:border-[#20332d]">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <AppLogo
            size="sm"
            showSubtitle={true}
            subtitle="مَكْتَبَتُكَ المَحْفُوظَة"
          />

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-xl text-[#5b6e67] dark:text-[#8ea59d] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            title="إغلاق القائمة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button matching ه.PNG */}
        <button
          onClick={() => {
            onNewChat();
            onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0d3a33] hover:bg-[#144940] text-white dark:bg-[#1a554a] dark:hover:bg-[#236b5d] text-xs font-semibold shadow-2xs active:scale-98 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>محادثة جديدة</span>
        </button>

        {/* Search input */}
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="بحث في المحفوظات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-2.5 pr-7 py-1.5 rounded-xl bg-[#ede5d6] dark:bg-[#192b25] border border-[#dcd1be] dark:border-[#263e36] text-xs text-[#1c2925] dark:text-[#e2eee9] placeholder-[#7d8f88] dark:placeholder-[#667a73] outline-none focus:border-[#0d3a33]"
          />
          <Search className="w-3.5 h-3.5 text-[#7d8f88] absolute right-2 top-2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-2 top-2 text-[#7d8f88] hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category Sections matching ه.PNG */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-3">
        {CATEGORIES.map((cat) => {
          const catMessages = getMessagesForCategory(cat.id);
          const Icon = cat.icon;
          const isCollapsed = collapsedCategories[cat.id] ?? false;

          return (
            <div
              key={cat.id}
              className="rounded-2xl bg-[#f5ede0]/60 dark:bg-[#182823]/60 border border-[#e4dbca] dark:border-[#243932] overflow-hidden"
            >
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategoryCollapse(cat.id)}
                className="w-full flex items-center justify-between p-2.5 sm:p-3 text-xs sm:text-sm font-bold text-[#1a2b26] dark:text-[#dbeae4] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#0d3a33] dark:text-[#6ee7b7]" />
                  <span>{cat.label}</span>
                  {catMessages.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#0d3a33]/10 text-[#0d3a33] dark:bg-[#6ee7b7]/10 dark:text-[#6ee7b7] font-mono">
                      {catMessages.length}
                    </span>
                  )}
                </div>
                <div>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-[#7d8f88]" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-[#7d8f88]" />
                  )}
                </div>
              </button>

              {/* Category Items or Empty state matching ه.PNG */}
              {!isCollapsed && (
                <div className="px-2 pb-2.5 pt-0.5 space-y-1">
                  {catMessages.length === 0 ? (
                    <p className="text-[11px] sm:text-xs text-[#798d86] dark:text-[#789088] py-2 px-2 text-center font-alexandria">
                      لا توجد محادثات بعد
                    </p>
                  ) : (
                    catMessages.map((msg) => {
                      const isActive = activeMessageId === msg.id;
                      return (
                        <div
                          key={msg.id}
                          onClick={() => {
                            onSelectMessage(msg);
                            onCloseMobile();
                          }}
                          className={`group flex items-center justify-between gap-1.5 p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                            isActive
                              ? 'bg-[#0d3a33] text-white font-semibold shadow-2xs'
                              : 'text-[#2b3c37] dark:text-[#cbdcd6] hover:bg-[#eae0cf] dark:hover:bg-[#1e322b]'
                          }`}
                        >
                          <span className="truncate flex-1 text-right font-medium">
                            {msg.question || 'سؤال بصورة مرفقة'}
                          </span>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 flex-shrink-0">
                            {msg.starred && (
                              <Star
                                className={`w-3 h-3 fill-amber-400 text-amber-400 ${
                                  isActive ? 'text-amber-300' : ''
                                }`}
                              />
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteMessage(msg.id);
                              }}
                              className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                                isActive
                                  ? 'hover:bg-white/20 text-white'
                                  : 'hover:bg-red-500/10 text-red-500'
                              }`}
                              title="حذف من المحفوظات"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#ebdfcb] dark:border-[#20332d] text-[11px] text-[#6b7e77] dark:text-[#7e958e] flex items-center justify-between">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>حفظ تلقائي في الذاكرة</span>
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (matches ه.PNG exactly on large screens) */}
      <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 h-[calc(100vh-57px)] sticky top-[57px] overflow-hidden border-l border-[#ded5c2] dark:border-[#263c35]">
        {content}
      </aside>

      {/* Mobile Animated Drawer (matches mobile responsiveness seamlessly) */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Animated Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={onCloseMobile}
            />
            {/* Spring Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-72 sm:w-80 max-w-[85vw] h-full shadow-2xl z-10 overflow-hidden"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
