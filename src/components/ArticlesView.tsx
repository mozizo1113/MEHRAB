import React, { useState } from 'react';
import { BookOpen, Clock, User, ArrowRight, Share2, Sparkles, Check, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ARABIC_ARTICLES } from '../data/articles';
import { Article } from '../types';

interface ArticlesViewProps {
  onBack: () => void;
  onAskQuestion?: (query: string) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({ onBack, onAskQuestion }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['الكل', 'نحو', 'بلاغة', 'معاجم وبيان', 'أدب وفصاحة'];

  const filteredArticles = ARABIC_ARTICLES.filter((art) => {
    const matchesCategory = filterCategory === 'الكل' || art.category === filterCategory;
    const matchesSearch =
      art.title.includes(searchQuery) ||
      art.summary.includes(searchQuery) ||
      art.content.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleShare = (article: Article) => {
    const textToCopy = `${article.title}\n\n${article.summary}\n\nمن مقالات محراب البيان العربي`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 font-alexandria text-right animate-in fade-in duration-200">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e3d8c2] dark:border-[#263c35]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0d3a33] text-[#d4af37] dark:bg-[#194c40] dark:text-[#6ee7b7] flex items-center justify-center shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#14231f] dark:text-[#eaf4ef]">
              المقالات والدراسات اللغوية
            </h1>
            <p className="text-xs text-[#5d7069] dark:text-[#8ea49c]">
              دراسات وبحوث مقالية رصينة في أسرار النحو والبلاغة وغريب الألفاظ
            </p>
          </div>
        </div>

        <button
          id="back-from-articles-btn"
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#d8cdb6] dark:border-[#273c35] bg-[#fbf8f0] dark:bg-[#142420] hover:bg-[#ede3cf] dark:hover:bg-[#1e342e] text-[#22352f] dark:text-[#cde0d8] text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <span>العودة للمحراب</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {selectedArticle ? (
        /* Full Article Detail Reading View */
        <div className="bg-[#fbf7ee] dark:bg-[#13221e] rounded-3xl border border-[#ded2bd] dark:border-[#243a33] p-5 sm:p-8 shadow-xs animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#e9dcbe] dark:border-[#20342e]">
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-xs font-semibold text-[#0d3a33] dark:text-[#6ee7b7] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>← العودة لقائمة المقالات</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0d3a33]/10 dark:bg-[#6ee7b7]/15 text-[#0d3a33] dark:text-[#6ee7b7]">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => handleShare(selectedArticle)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#ded2bd] dark:border-[#273d36] bg-[#f8f2e2] dark:bg-[#182723] text-xs text-[#2a3c36] dark:text-[#c4d6d0] hover:bg-[#efe5d0] dark:hover:bg-[#20332d] transition-colors cursor-pointer"
                title="نسخ المقال"
              >
                {copiedId === selectedArticle.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3 h-3" />
                    <span>مشاركة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-alexandria text-[#13221e] dark:text-[#e6f2ed] mb-3 leading-snug">
            {selectedArticle.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#63766f] dark:text-[#8ca29a] mb-6">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {selectedArticle.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              وقت القراءة: {selectedArticle.readTime}
            </span>
            <span>•</span>
            <span>{selectedArticle.date}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#efe5d2]/60 dark:bg-[#1a2d27]/70 border-r-4 border-[#0d3a33] dark:border-[#34d399] mb-6 text-sm text-[#273b35] dark:text-[#cedfd8] leading-relaxed">
            <strong>خلاصة المقال: </strong>
            {selectedArticle.summary}
          </div>

          {/* Article Markdown Body with elegant typography */}
          <div className="prose-arabic leading-loose text-[#1a2925] dark:text-[#dbe9e3] text-sm sm:text-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {selectedArticle.content}
            </ReactMarkdown>
          </div>

          {/* Bottom Callout: Ask AI about this article */}
          {onAskQuestion && (
            <div className="mt-8 pt-6 border-t border-[#ebdcc4] dark:border-[#223730] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#f5ede0] dark:bg-[#172722] p-4 rounded-2xl">
              <div className="text-right">
                <h4 className="text-xs sm:text-sm font-bold text-[#14231f] dark:text-[#e4efe9]">
                  هل لديك استفسار نحوي أو بلاغي حول هذا المقال؟
                </h4>
                <p className="text-[11px] sm:text-xs text-[#5e716a] dark:text-[#8fa39b]">
                  اسأل محراب البيان وسيقوم بالإعراب والتحليل البياني الفوري
                </p>
              </div>
              <button
                onClick={() => {
                  onAskQuestion(`استفسار حول مقال «${selectedArticle.title}»: اشرح لي بتفصيل أكثر عن النقاط البلاغية واللغوية الواردة فيه.`);
                  onBack();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d3a33] hover:bg-[#144d44] text-white text-xs font-semibold cursor-pointer shadow-xs active:scale-95 transition-all flex-shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
                <span>سؤال المحراب حول المقال</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Articles Grid View */
        <div>
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-[#0d3a33] text-white dark:bg-[#194c40] dark:text-[#a7f3d0] shadow-2xs'
                      : 'bg-[#f4ede0] dark:bg-[#162723] text-[#334640] dark:text-[#b4cbbf] hover:bg-[#ebe0ce] dark:hover:bg-[#1e342e]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المقالات..."
                className="w-full bg-[#fcf9f2] dark:bg-[#121f1c] border border-[#dcd0ba] dark:border-[#273c35] rounded-xl px-3 py-1.5 pl-8 text-xs text-[#1e2f2a] dark:text-[#e4efe9] outline-none focus:border-[#0d3a33] dark:focus:border-[#6ee7b7] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#738780] dark:text-[#6a8078] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4 Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article, idx) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group relative flex flex-col justify-between p-5 rounded-3xl bg-[#fbf7ee] dark:bg-[#13221e] border border-[#ded2bd] dark:border-[#243a33] hover:border-[#0d3a33] dark:hover:border-[#6ee7b7] transition-all cursor-pointer shadow-2xs hover:shadow-md active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#0d3a33]/10 dark:bg-[#6ee7b7]/15 text-[#0d3a33] dark:text-[#6ee7b7]">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-[#6b7e77] dark:text-[#889f96] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#14231f] dark:text-[#e6f2ed] mb-2 group-hover:text-[#0d3a33] dark:group-hover:text-[#6ee7b7] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#52665f] dark:text-[#9bb0a7] line-clamp-3 leading-relaxed mb-4">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#ede0c8] dark:border-[#1e322b] flex items-center justify-between text-xs text-[#63766f] dark:text-[#8aa097]">
                  <span className="flex items-center gap-1 text-[11px]">
                    <User className="w-3 h-3" />
                    {article.author}
                  </span>
                  <span className="font-semibold text-[#0d3a33] dark:text-[#6ee7b7] group-hover:translate-x-[-3px] transition-transform inline-flex items-center gap-1">
                    <span>قراءة المقال</span>
                    <span>←</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-[#6e8079] dark:text-[#8ca199]">
              <p className="text-sm font-medium">لم يتم العثور على مقالات مطابقة لبحثك.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
