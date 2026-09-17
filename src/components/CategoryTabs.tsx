import React from 'react';
import { BookOpen, Sparkles, Feather, ScrollText } from 'lucide-react';
import { motion } from 'motion/react';
import { AppMode } from '../types';

interface CategoryTabsProps {
  activeMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeMode,
  onSelectMode,
}) => {
  const tabs = [
    {
      id: 'grammar' as AppMode,
      label: 'نحو وصرف',
      shortLabel: 'نحو وصرف',
      icon: BookOpen,
    },
    {
      id: 'rhetoric' as AppMode,
      label: 'بلاغة',
      shortLabel: 'بلاغة',
      icon: Sparkles,
    },
    {
      id: 'composition' as AppMode,
      label: 'تعبير',
      shortLabel: 'تعبير',
      icon: Feather,
    },
    {
      id: 'literature' as AppMode,
      label: 'أدب ونصوص',
      shortLabel: 'أدب ونصوص',
      icon: ScrollText,
    },
  ];

  return (
    <div className="w-full flex justify-center py-1.5 sm:py-2 px-2 sm:px-4">
      <div className="w-full max-w-3xl flex items-center justify-between gap-1 p-1 rounded-2xl bg-[#eee7d8] dark:bg-[#192723] border border-[#ded5c2] dark:border-[#253933] shadow-xs overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeMode === tab.id ||
            (activeMode === 'grammar_rhetoric' && tab.id === 'grammar');

          return (
            <motion.button
              whileTap={{ scale: 0.96 }}
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => onSelectMode(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-white dark:text-emerald-100'
                  : 'text-[#445650] dark:text-[#a0b5ae] hover:text-[#0f3e36] dark:hover:text-white hover:bg-[#e4dcce] dark:hover:bg-[#20332e]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-[#0f3e36] dark:bg-[#1b554b] rounded-xl shadow-sm -z-0"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon
                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                    isActive ? 'text-amber-300' : 'text-current'
                  }`}
                />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
