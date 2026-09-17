import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookA, Sparkles } from 'lucide-react';
import { AppMode } from '../types';

interface HeroCardProps {
  mode: AppMode;
  onSelectPrompt: (promptText: string) => void;
  onDirectSubmit?: (promptText: string) => void;
}

const COMPLEX_WORDS = [
  { word: 'العَرَمْرَم', hint: 'الجيش الضخم' },
  { word: 'العَسْجَد', hint: 'الذهب الخالص' },
  { word: 'الكؤود', hint: 'العقبة الشديدة' },
  { word: 'الغَيْداق', hint: 'الكريم واسع العطاء' },
  { word: 'الصِّنْدِيد', hint: 'الشجاع السيد' },
  { word: 'السَّجْسَج', hint: 'الهواء المعتدل' },
  { word: 'الضِّيزَى', hint: 'الجائرة الناقصة' },
  { word: 'اليَهْمَاء', hint: 'الصحراء المترامية' },
];

export const HeroCard: React.FC<HeroCardProps> = ({
  mode,
  onSelectPrompt,
  onDirectSubmit,
}) => {
  const [searchWord, setSearchWord] = useState('');

  const triggerWord = (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;
    const prompt = `اشرح معنى كلمة «${trimmed}» لغوياً وبلاغياً، واكشف عن أصل اشتقاقها وظلالها البيانية وسر فصاحتها وشواهدها الأدبية`;
    if (onDirectSubmit) {
      onDirectSubmit(prompt);
    } else {
      onSelectPrompt(prompt);
    }
  };

  const handleWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchWord.trim()) {
      triggerWord(searchWord);
      setSearchWord('');
    }
  };

  const getPromptsForMode = (currentMode: AppMode) => {
    switch (currentMode) {
      case 'grammar':
      case 'grammar_rhetoric':
        // Exact prompts matching user reference image ع.PNG
        return [
          { text: 'أعرب: إنّ العلمَ نورٌ يهدي صاحبَه' },
          { text: 'ما الفرق بين الحال والتمييز؟' },
          { text: 'استخرج الصورة البلاغية في: وأشرقتِ الدنيا بوجهِ محمدٍ' },
          { text: 'متى تُحذف نون المثنى وجمع المذكر؟' },
        ];
      case 'rhetoric':
        return [
          { text: 'ما معنى كلمة «العَرَمْرَم» في معاجم اللغة وسرها البلاغي والبياني؟' },
          { text: 'اشرح معنى الكلمة المعقدة «الكؤود» وظلالها البلاغية في الشعر' },
          { text: 'ما معنى كلمة «العَسْجَد» ولماذا يُفضّلها الشعراء على لفظ الذهب؟' },
          { text: 'استخرج الصورة البلاغية وسر الجمال في: وأشرقتِ الدنيا بوجهِ محمدٍ' },
        ];
      case 'literature':
        return [
          { text: 'حلل الأبيات: إذا الشعب يوماً أراد الحياة فلا بد أن يستجيب القدر' },
          { text: 'ما الخصائص الفنية لشعر مدرسة الإحياء والبعث؟' },
          { text: 'اشرح بيت المتنبي: على قدر أهل العزم تأتي العزائم' },
          { text: 'ما الفرق بين الصورة الكلية والصورة الجزئية في النصوص؟' },
        ];
      case 'composition':
        return [
          { text: 'موضوع تعبير عن: فضل المعلم ورسالته السامية في بناء الأجيال' },
          { text: 'موضوع تعبير عن: أهمية القراءة والمطالعة في تنوير العقول' },
          { text: 'موضوع تعبير عن: حب الوطن والوفاء لترابه مع الشواهد' },
          { text: 'موضوع تعبير عن: الأخلاق الفاضلة وأثرها في تماسك المجتمع' },
        ];
      default:
        return [];
    }
  };

  const prompts = getPromptsForMode(mode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-3 text-center"
    >
      {/* Central Emblem matching reference screenshot Capture.PNG */}
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center filter drop-shadow-sm select-none">
          <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Islamic 8-Pointed Star / Mandala Facets in Gold and Teal */}
            <path
              d="M40 4L46 16.5L59 13.5L58 27L70.5 33L63.5 45L72.5 55.5L60 61L55.5 73.5L43 68.5L40 79L37 68.5L24.5 73.5L20 61L7.5 55.5L16.5 45L9.5 33L22 27L21 13.5L34 16.5L40 4Z"
              fill="#0d3a33"
              fillOpacity="0.08"
              stroke="#c5a059"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M40 10L44.5 20L55 17.5L54 28L64 33L58.5 43L65.5 51.5L55.5 56L52 66L42 62L40 70L38 62L28 66L24.5 56L14.5 51.5L21.5 43L16 33L26 28L25 17.5L35.5 20L40 10Z"
              stroke="#0d3a33"
              strokeWidth="1"
              strokeOpacity="0.35"
              fill="none"
            />

            {/* Open Holy Quran / Book at base in dark teal with gold border */}
            <path
              d="M40 54C34 50 25 49 17 51V65C25 63 34 64 40 68.5C46 64 55 63 63 65V51C55 49 46 50 40 54Z"
              fill="#08231e"
              stroke="#c5a059"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Pages details */}
            <path
              d="M40 54V68.5M20 54.5C26 53.5 33 54.5 38 57M60 54.5C54 53.5 47 54.5 42 57"
              stroke="#d4af37"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Golden Calligraphy Pen Nib rising from book */}
            <path
              d="M40 12C40 12 46.5 22 46.5 34C46.5 39 44 45 40 52C36 45 33.5 39 33.5 34C33.5 22 40 12 40 12Z"
              fill="url(#goldEmblemGrad)"
              stroke="#e6ca65"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Pen Slit & Breather Hole */}
            <line x1="40" y1="13" x2="40" y2="33" stroke="#08231e" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="40" cy="33" r="2.2" fill="#08231e" stroke="#c5a059" strokeWidth="1" />

            {/* Flourish side wings */}
            <path
              d="M33.5 29C28 26.5 22 31 19 38C24 38.5 29 36 33.5 34"
              stroke="#d4af37"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M46.5 29C52 26.5 58 31 61 38C56 38.5 51 36 46.5 34"
              stroke="#d4af37"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            <defs>
              <linearGradient id="goldEmblemGrad" x1="33.5" y1="12" x2="46.5" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fdf0b5" />
                <stop offset="45%" stopColor="#d8b240" />
                <stop offset="100%" stopColor="#9e7518" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Heading matching Capture.PNG */}
      <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold font-alexandria text-[#172521] dark:text-[#e4efe9] mb-1.5 tracking-tight">
        ابدأ محادثة جديدة
      </h2>

      {/* Subtitle matching Capture.PNG */}
      <p className="text-xs sm:text-[13.5px] text-[#566761] dark:text-[#9bb1a9] font-alexandria max-w-xl mx-auto mb-4 sm:mb-6 leading-relaxed">
        اختر القسم ثم اكتب سؤالك، وستُحفظ المحادثة في مكتبتك تلقائيًا.
      </p>

      {/* Dedicated Word Explanation Tool for Rhetoric Section */}
      {mode === 'rhetoric' && (
        <div className="mb-5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#f8f3e8] dark:bg-[#152420] border border-[#e2d5be] dark:border-[#273d36] shadow-xs text-right animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0d3a33] dark:bg-[#1d4d42] text-[#d4af37] dark:text-[#6ee7b7] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <BookA className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold font-alexandria text-[#13221e] dark:text-[#e4efe9]">
                  معجم البلاغة: شرح غريب الألفاظ والكلمات المعقدة
                </h3>
                <p className="text-[10.5px] sm:text-[11.5px] text-[#5e716a] dark:text-[#8ea49c]">
                  اكتب أي كلمة عربية صعبة أو نادرة ليكشف لك سر معناها اللغوي وظلالها البيانية وشواهدها
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0d3a33]/10 dark:bg-[#6ee7b7]/15 text-[#0d3a33] dark:text-[#6ee7b7]">
              قسم البلاغة
            </span>
          </div>

          {/* Search / Ask Box */}
          <form
            onSubmit={handleWordSubmit}
            className="relative flex items-center gap-1.5 my-2.5"
          >
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="اكتب كلمة صعبة أو غريبة هنا (مثال: العَرَمْرَم، الكؤود، العَسْجَد...)"
              className="w-full bg-[#fdfbf7] dark:bg-[#101b18] border border-[#ded3be] dark:border-[#2a4138] rounded-xl px-3.5 py-2 text-xs sm:text-[13px] text-[#1a2824] dark:text-[#e1ece7] placeholder-[#8d9e97] dark:placeholder-[#5b7169] outline-none focus:border-[#0d3a33] dark:focus:border-[#6ee7b7] transition-all"
            />
            <button
              type="submit"
              disabled={!searchWord.trim()}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0d3a33] hover:bg-[#144d44] disabled:bg-[#d8ceba] dark:disabled:bg-[#20312b] text-white disabled:text-[#8c826e] dark:disabled:text-[#4d6159] text-xs font-semibold cursor-pointer disabled:cursor-not-allowed transition-all active:scale-95 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-emerald-300" />
              <span>شرح الكلمة</span>
            </button>
          </form>

          {/* Famous Complex Words Quick Chips */}
          <div className="pt-2 border-t border-[#ebdcc7] dark:border-[#1d2f29]">
            <div className="flex items-center gap-1.5 mb-1.5 text-[10.5px] sm:text-[11px] text-[#4d5f58] dark:text-[#9bb0a8] font-medium">
              <span>جرّب كلمات فصيحة معقدة ونادرة:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMPLEX_WORDS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => triggerWord(item.word)}
                  title={`معنى: ${item.hint}`}
                  className="group flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#dfd4be] dark:border-[#283e35] bg-[#fdfbf7] dark:bg-[#182723] hover:bg-[#ede3ce] dark:hover:bg-[#20352e] hover:border-[#cbba9e] dark:hover:border-[#38564a] text-[11px] text-[#22332e] dark:text-[#cde0d9] transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <span className="font-bold font-alexandria text-[#0d3a33] dark:text-[#6ee7b7]">
                    {item.word}
                  </span>
                  <span className="text-[9.5px] text-[#6d7e77] dark:text-[#889d95]">
                    ({item.hint})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2x2 Suggested prompt cards matching reference screenshot ع.PNG exactly (Font, size, pills, no arrows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-2xl mx-auto text-right">
        {prompts.map((item, index) => (
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.985 }}
            key={index}
            id={`suggested-prompt-${index}`}
            onClick={() => onSelectPrompt(item.text)}
            className="group px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-[#fbf9f4] dark:bg-[#182723] border border-[#e7ded0] dark:border-[#273d36] hover:border-[#d6c9b5] dark:hover:border-[#3d5a50] hover:bg-[#f4ede0] dark:hover:bg-[#1e322b] shadow-2xs transition-all duration-150 text-right cursor-pointer block w-full"
          >
            <span className="font-['Cairo',sans-serif] text-xs sm:text-[13.5px] text-[#22342e] dark:text-[#d3e5df] leading-relaxed block">
              {item.text}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

