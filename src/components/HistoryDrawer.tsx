import React, { useState } from 'react';
import { X, Search, Star, Trash2, BookOpen, ScrollText, Feather, Calendar } from 'lucide-react';
import { ChatMessage, AppMode } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSelectMessage: (msg: ChatMessage) => void;
  onToggleStar: (id: string) => void;
  onDeleteMessage: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSelectMessage,
  onToggleStar,
  onDeleteMessage,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStarred, setFilterStarred] = useState(false);

  if (!isOpen) return null;

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStarred = filterStarred ? m.starred : true;
    return matchesSearch && matchesStarred;
  });

  const getModeIcon = (mode: AppMode) => {
    switch (mode) {
      case 'grammar_rhetoric':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />;
      case 'literature':
        return <ScrollText className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />;
      case 'composition':
        return <Feather className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />;
      default:
        return null;
    }
  };

  const getModeLabel = (mode: AppMode) => {
    switch (mode) {
      case 'grammar_rhetoric':
        return 'نحو وإعراب';
      case 'literature':
        return 'أدب ونصوص';
      case 'composition':
        return 'موضوع تعبير';
      default:
        return 'لغة عربية';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Drawer Overlay backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-[#fbf8f1] dark:bg-[#152320] border-l border-[#e4dbca] dark:border-[#253933] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#eee5d4] dark:border-[#20332d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-amiri font-bold text-lg text-[#162521] dark:text-[#e4efe9]">
              سجل المحادثات والأسئلة
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#0f3e36]/10 text-[#0f3e36] dark:bg-[#6ee7b7]/10 dark:text-[#6ee7b7] font-mono font-bold">
              {messages.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#6c7f77] hover:text-[#182622] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter bar */}
        <div className="p-3 border-b border-[#eee5d4] dark:border-[#20332d] space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث في الأسئلة أو الإجابات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-[#f2ebd9] dark:bg-[#1b2b26] border border-[#ded5c2] dark:border-[#273d36] text-xs sm:text-sm text-[#192723] dark:text-[#e2eee9] placeholder-[#7f908a] dark:placeholder-[#647972] outline-none focus:border-[#0f3e36]"
            />
            <Search className="w-4 h-4 text-[#7f908a] absolute right-3 top-2.5" />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setFilterStarred((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                filterStarred
                  ? 'bg-amber-500/15 border-amber-400 text-amber-900 dark:text-amber-300'
                  : 'border-[#ded5c2] dark:border-[#273d36] text-[#4d5f59] dark:text-[#a0b5ae] hover:bg-black/5'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  filterStarred ? 'fill-amber-400 text-amber-500' : 'text-current'
                }`}
              />
              <span>المفضلة فقط</span>
            </button>

            {messages.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من مسح جميع الأسئلة المحفوظة في السجل؟')) {
                    onClearAll();
                  }
                }}
                className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 px-2 py-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح السجل</span>
              </button>
            )}
          </div>
        </div>

        {/* Message Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-[#748780] dark:text-[#7f978f]">
              <p className="text-sm font-amiri font-medium mb-1">
                {searchQuery || filterStarred
                  ? 'لا توجد نتائج مطابقة لبحثك'
                  : 'لا يوجد أسئلة محفوظة في السجل حتى الآن'}
              </p>
              <p className="text-xs">
                اطرح أي سؤال في النحو أو البلاغة أو التعبير ليتم حفظه تلقائياً هنا للرجوع إليه
              </p>
            </div>
          ) : (
            filtered.map((msg) => (
              <div
                key={msg.id}
                className="group p-3.5 rounded-2xl bg-[#f6efe2] dark:bg-[#1a2a26] border border-[#e5dcce] dark:border-[#253a34] hover:border-[#0f3e36]/50 dark:hover:border-[#6ee7b7]/50 transition-all cursor-pointer shadow-xs"
                onClick={() => {
                  onSelectMessage(msg);
                  onClose();
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#e9e0ce] dark:bg-[#20342e] text-[#2c3d37] dark:text-[#a5bcb4]">
                    {getModeIcon(msg.mode)}
                    {getModeLabel(msg.mode)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(msg.id);
                      }}
                      className="p-1 rounded-md text-[#788a83] hover:text-amber-500"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          msg.starred ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMessage(msg.id);
                      }}
                      className="p-1 rounded-md text-[#788a83] hover:text-red-500"
                      title="حذف من السجل"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-amiri font-bold text-[#182622] dark:text-[#e4efe9] line-clamp-2 leading-relaxed text-right mb-1">
                  {msg.question || 'سؤال عبر صورة مرفقة'}
                </p>

                <p className="text-[11px] text-[#60736c] dark:text-[#8ba29a] line-clamp-2 font-amiri text-right">
                  {msg.answer.replace(/[#*`_~[\]()|]/g, '')}
                </p>

                <div className="mt-2 flex items-center justify-between text-[10px] text-[#80928b] dark:text-[#6a8079]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleDateString('ar-EG', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {msg.image && (
                    <span className="text-[10px] bg-emerald-900/10 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded font-medium">
                      مرفق صورة 📷
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
