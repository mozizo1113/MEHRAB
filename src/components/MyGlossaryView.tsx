import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Plus,
  Trash2,
  Search,
  ArrowRight,
  BookOpen,
  Sparkles,
  Share2,
  Check,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { GlossaryTerm } from '../types';

interface MyGlossaryViewProps {
  onBack: () => void;
  onAskAboutTerm: (term: string) => void;
}

const STORAGE_KEY = 'mihrab_personal_glossary_v1';

const INITIAL_STARTER_TERMS: GlossaryTerm[] = [
  {
    id: 'starter-1',
    term: 'الاستعارة المكنية',
    category: 'rhetoric',
    definition:
      'تشبيه بليغ حُذف منه المشبَّه به، ورُمز له بشيء من لوازمه أو خصائصه على سبيل الاستعارة لإضفاء الحيوية والتشخيص.',
    subtext: 'من أركان علم البيان وتُكسب المعاني الجافة جسداً ناطقاً',
    example: '«واشتعل الرأس شيباً» - شُبّه الشيب بنار مستعرة وحُذفت النار ورُمز لها بالاشتعال.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'starter-2',
    term: 'الممنوع من الصرف',
    category: 'grammar',
    definition:
      'اسم معرب لا يدخله التنوين، ويُجر بالفتحة نيابة عن الكسرة ما لم يُضف أو يقترن بأل التعريف.',
    subtext: 'يُمنع لعلة واحدة (كصيغة منتهى الجموع) أو لعلتين (العلمية والوصفية مع علة أخرى)',
    example: '«مررتُ بمساجدَ أثريةٍ» - مساجد مجرورة بالفتحة لأنها صيغة منتهى الجموع.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'starter-3',
    term: 'العَرَمْرَم',
    category: 'vocabulary',
    definition:
      'الجيش الكثير ذو اللجب والغبار المتراكم، وسُمي عَرَمْرَماً لشدته وكثرته كالسيل العرم أو الصخر الصلب.',
    subtext: 'لفظ فصيح تراثي يدل على الكثرة البالغة مع المهابة والقوة',
    example: '«زحف الجيش العرمرم فارتجت له أرجاء البيداء»',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'starter-4',
    term: 'الجناس التام',
    category: 'rhetoric',
    definition:
      'محسن بديعي لفظي تتفق فيه كلمتان في أربعة أمور: نوع الحروف، عددها، ترتيبها، وضبطها، مع اختلاف تام في المعنى.',
    subtext: 'يمنح الكلام نغماً موسيقياً يطرب الأذن ويستفز الذهن للتفكر',
    example: '«ويوم تقوم الساعة يقسم المجرمون ما لبثوا غير ساعة» (القيامة vs وحدة الزمن).',
    createdAt: new Date().toISOString(),
  },
];

export const MyGlossaryView: React.FC<MyGlossaryViewProps> = ({
  onBack,
  onAskAboutTerm,
}) => {
  const [terms, setTerms] = useState<GlossaryTerm[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_STARTER_TERMS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New term form state
  const [newTerm, setNewTerm] = useState('');
  const [newCategory, setNewCategory] = useState<'grammar' | 'rhetoric' | 'vocabulary' | 'literature'>('grammar');
  const [newDefinition, setNewDefinition] = useState('');
  const [newExample, setNewExample] = useState('');

  // Persist to localStorage whenever terms change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
    } catch (e) {
      console.error('Error saving glossary to localStorage', e);
    }
  }, [terms]);

  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.trim() || !newDefinition.trim()) return;

    const termItem: GlossaryTerm = {
      id: 'term-' + Date.now(),
      term: newTerm.trim(),
      category: newCategory,
      definition: newDefinition.trim(),
      example: newExample.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setTerms((prev) => [termItem, ...prev]);
    setNewTerm('');
    setNewDefinition('');
    setNewExample('');
    setIsAddModalOpen(false);
  };

  const handleDeleteTerm = (id: string) => {
    if (confirm('هل تريد بالتأكيد إزالة هذا المصطلح من معجمك الخاص؟')) {
      setTerms((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleCopyTerm = (item: GlossaryTerm) => {
    const text = `المصطلح: ${item.term}\nالقسم: ${getCategoryLabel(item.category)}\nالشرح: ${item.definition}${item.example ? `\nالشاهد/المثال: ${item.example}` : ''}\n(من معجمي الخاص في محراب البيان)`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'grammar':
        return 'نحو وإعراب';
      case 'rhetoric':
        return 'علم البلاغة والبيان';
      case 'vocabulary':
        return 'غريب الألفاظ والمعاجم';
      case 'literature':
        return 'أدب ونصوص';
      default:
        return 'مصطلح لغوي';
    }
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'grammar':
        return 'bg-emerald-900/10 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-300';
      case 'rhetoric':
        return 'bg-purple-900/10 text-purple-900 dark:bg-purple-400/15 dark:text-purple-300';
      case 'vocabulary':
        return 'bg-amber-900/10 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300';
      default:
        return 'bg-teal-900/10 text-teal-900 dark:bg-teal-400/15 dark:text-teal-300';
    }
  };

  const filteredTerms = terms.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      item.term.includes(searchQuery) ||
      item.definition.includes(searchQuery) ||
      (item.example && item.example.includes(searchQuery));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 font-alexandria text-right animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#e3d8c2] dark:border-[#263c35]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0d3a33] text-[#d4af37] dark:bg-[#194c40] dark:text-[#6ee7b7] flex items-center justify-center shadow-xs">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#14231f] dark:text-[#eaf4ef]">
              معجمي الخاص (المصطلحات المحفوظة)
            </h1>
            <p className="text-xs text-[#5d7069] dark:text-[#8ea49c]">
              مكتبتك الشخصية لحفظ ومراجعة المصطلحات النحوية والبلاغية وغريب الألفاظ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            id="add-term-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0d3a33] hover:bg-[#144d44] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة مصطلح يدوي</span>
          </button>

          <button
            id="back-from-glossary-btn"
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#d8cdb6] dark:border-[#273c35] bg-[#fbf8f0] dark:bg-[#142420] hover:bg-[#ede3cf] dark:hover:bg-[#1e342e] text-[#22352f] dark:text-[#cde0d8] text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <span>العودة للمحراب</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: `الكل (${terms.length})` },
            { id: 'grammar', label: 'نحو وإعراب' },
            { id: 'rhetoric', label: 'بلاغة وبيان' },
            { id: 'vocabulary', label: 'غريب الألفاظ' },
            { id: 'literature', label: 'أدب ونصوص' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#0d3a33] text-white dark:bg-[#194c40] dark:text-[#a7f3d0] shadow-2xs'
                  : 'bg-[#f4ede0] dark:bg-[#162723] text-[#334640] dark:text-[#b4cbbf] hover:bg-[#ebe0ce] dark:hover:bg-[#1e342e]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في معجمك الخاص..."
            className="w-full bg-[#fcf9f2] dark:bg-[#121f1c] border border-[#dcd0ba] dark:border-[#273c35] rounded-xl px-3 py-1.5 pl-8 text-xs text-[#1e2f2a] dark:text-[#e4efe9] outline-none focus:border-[#0d3a33] dark:focus:border-[#6ee7b7] transition-all"
          />
          <Search className="w-3.5 h-3.5 text-[#738780] dark:text-[#6a8078] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredTerms.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#fbf7ee] dark:bg-[#13221e] border border-[#ded2bd] dark:border-[#243a33] hover:border-[#0d3a33]/60 dark:hover:border-[#6ee7b7]/60 transition-all shadow-2xs text-right"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${getCategoryBadgeColor(
                    item.category
                  )}`}
                >
                  {getCategoryLabel(item.category)}
                </span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopyTerm(item)}
                    title="نسخ المصطلح"
                    className="p-1 rounded-md text-[#536760] dark:text-[#8ea49b] hover:bg-[#ede1ca] dark:hover:bg-[#1f332c] transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteTerm(item.id)}
                    title="حذف من المعجم"
                    className="p-1 rounded-md text-red-500/80 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-black font-alexandria text-[#13221e] dark:text-[#e7f4ee] mb-1.5">
                «{item.term}»
              </h3>

              {item.subtext && (
                <p className="text-[11px] text-[#556962] dark:text-[#8ea39b] mb-2 font-medium">
                  {item.subtext}
                </p>
              )}

              <p className="text-xs sm:text-[13px] text-[#22332e] dark:text-[#cadcd5] leading-relaxed mb-3">
                {item.definition}
              </p>

              {item.example && (
                <div className="p-2.5 rounded-xl bg-[#ede3cf]/60 dark:bg-[#182924] border-r-2 border-[#0d3a33] dark:border-[#34d399] text-[11.5px] text-[#2b3c36] dark:text-[#b4c9c1] mb-2">
                  <span className="font-bold text-[#14231f] dark:text-[#e4efe9]">الشاهد أو المثال: </span>
                  {item.example}
                </div>
              )}
            </div>

            <div className="pt-3 mt-2 border-t border-[#ebdcc7] dark:border-[#1d2f29] flex items-center justify-between text-[11px]">
              <span className="text-[#697d75] dark:text-[#7f958d]">
                {new Date(item.createdAt).toLocaleDateString('ar-EG', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <button
                onClick={() => {
                  onAskAboutTerm(
                    `اشرح لي بتفصيل دقيق وتطبيق عملي مفهوم «${item.term}» مع مزيد من الشواهد والأمثلة الإعرابية والبلاغية`
                  );
                  onBack();
                }}
                className="flex items-center gap-1 font-semibold text-[#0d3a33] dark:text-[#6ee7b7] hover:underline cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                <span>تحليل أعمق في المحراب</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12 rounded-3xl border border-dashed border-[#d8ccb6] dark:border-[#273d36] bg-[#faf6ee] dark:bg-[#12201d] p-8 text-[#5f736c] dark:text-[#8ba098]">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-[#0d3a33] dark:text-[#6ee7b7] opacity-60" />
          <p className="text-sm font-semibold mb-1">لا توجد مصطلحات محفوظة في هذا القسم</p>
          <p className="text-xs text-[#7e928a] dark:text-[#697f77] mb-4">
            يمكنك حفظ أي مصطلح مباشرة من نتائج الإجابات أو إضافة مصطلح جديد يدويًا.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#0d3a33] text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            إضافة مصطلح الآن
          </button>
        </div>
      )}

      {/* Modal to Add New Term Manually */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#faf5ec] dark:bg-[#14231f] rounded-3xl border border-[#ded0b9] dark:border-[#263e36] p-5 sm:p-6 shadow-2xl text-right">
            <h3 className="text-base font-bold font-alexandria text-[#13221e] dark:text-[#e4efe9] mb-1">
              إضافة مصطلح إلى معجمك الخاص
            </h3>
            <p className="text-xs text-[#5e716a] dark:text-[#8ea39c] mb-4">
              سجّل المصطلح مع تعريفه لتراجعه وتستحضره في أي وقت
            </p>

            <form onSubmit={handleAddTerm} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#253731] dark:text-[#c4d7d0] mb-1">
                  المصطلح أو الكلمة:
                </label>
                <input
                  type="text"
                  required
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="مثال: المفعول المطلق، الاستعارة التصريحية، العَرَمْرَم..."
                  className="w-full bg-[#fcf9f2] dark:bg-[#101b18] border border-[#ded0b9] dark:border-[#283f37] rounded-xl px-3 py-2 text-xs text-[#1e2f2a] dark:text-[#e4efe9] outline-none focus:border-[#0d3a33] dark:focus:border-[#6ee7b7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#253731] dark:text-[#c4d7d0] mb-1">
                  القسم:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(
                      e.target.value as 'grammar' | 'rhetoric' | 'vocabulary' | 'literature'
                    )
                  }
                  className="w-full bg-[#fcf9f2] dark:bg-[#101b18] border border-[#ded0b9] dark:border-[#283f37] rounded-xl px-3 py-2 text-xs text-[#1e2f2a] dark:text-[#e4efe9] outline-none focus:border-[#0d3a33] dark:focus:border-[#6ee7b7]"
                >
                  <option value="grammar">نحو وإعراب</option>
                  <option value="rhetoric">علم البلاغة والبيان</option>
                  <option value="vocabulary">غريب الألفاظ والمعاجم</option>
                  <option value="literature">أدب ونصوص</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#253731] dark:text-[#c4d7d0] mb-1">
                  شرح المصطلح أو تعريفه:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  placeholder="اكتب الشرح والقاعدة باختصار وإتقان..."
                  className="w-full bg-[#fcf9f2] dark:bg-[#101b18] border border-[#ded0b9] dark:border-[#283f37] rounded-xl px-3 py-2 text-xs text-[#1e2f2a] dark:text-[#e4efe9] outline-none focus:border-[#0d3a33] dark:focus:border-[#6ee7b7] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#253731] dark:text-[#c4d7d0] mb-1">
                  الشاهد أو المثال (اختياري):
                </label>
                <input
                  type="text"
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="آية أو بيت شعر أو مثال تطبيقي..."
                  className="w-full bg-[#fcf9f2] dark:bg-[#101b18] border border-[#ded0b9] dark:border-[#283f37] rounded-xl px-3 py-2 text-xs text-[#1e2f2a] dark:text-[#e4efe9] outline-none focus:border-[#0d3a33] dark:focus:border-[#6ee7b7]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#d8ccb6] dark:border-[#283f37] text-xs font-semibold text-[#445650] dark:text-[#bad0c8] hover:bg-[#ede0ce] dark:hover:bg-[#1d302a] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0d3a33] hover:bg-[#144d44] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  حفظ في المعجم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
