import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Check, FileText, AlertCircle, Sparkles } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  isMandatoryGate?: boolean;
  onClose: () => void;
  onAccepted?: () => void;
}

const TERMS_ACCEPTED_KEY = 'mihrab_terms_accepted_v1';

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  isMandatoryGate = false,
  onClose,
  onAccepted,
}) => {
  const [hasAgreed, setHasAgreed] = useState<boolean>(() => {
    return localStorage.getItem(TERMS_ACCEPTED_KEY) === 'true';
  });
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isMandatoryGate) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isMandatoryGate]);

  if (!isOpen) return null;

  const handleSaveAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreed) return;
    localStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onAccepted?.();
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm font-alexandria text-right animate-in fade-in duration-150"
      onClick={(e) => {
        // Only allow clicking backdrop to close if not mandatory gate
        if (e.target === e.currentTarget && !isMandatoryGate) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#faf5eb] dark:bg-[#13221e] rounded-3xl border border-[#ded0b9] dark:border-[#273d36] p-5 sm:p-7 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-[#e5d8c1] dark:border-[#21352f] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0d3a33] text-[#d4af37] dark:bg-[#194c40] dark:text-[#6ee7b7] flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-[#13221e] dark:text-[#e7f4ee]">
                  وثيقة الشروط والأحكام وميثاق الاستخدام
                </h2>
                {isMandatoryGate && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    مطلوب للمتابعة
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#5e716a] dark:text-[#8ea49c]">
                محراب البيان - المدقق والمعلم اللغوي والنحوي العربي الذكي
              </p>
            </div>
          </div>

          {!isMandatoryGate && (
            <button
              onClick={onClose}
              title="إغلاق"
              className="p-1.5 rounded-xl border border-[#ded0b9] dark:border-[#273d36] text-[#4f625b] dark:text-[#a0b5ad] hover:bg-[#ebdcc6] dark:hover:bg-[#1e332d] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Terms Content */}
        <div className="overflow-y-auto pr-1 space-y-4 text-xs sm:text-[13px] text-[#243731] dark:text-[#cadcd4] leading-relaxed flex-grow custom-scrollbar">
          {isMandatoryGate && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                أهلاً بك في محراب البيان. يُرجى مراجعة الشروط والموافقة عليها أولاً لفتح واستخدام المنصة.
              </span>
            </div>
          )}

          <div className="p-3 rounded-2xl bg-[#eee3ce]/60 dark:bg-[#182924] border-r-3 border-[#0d3a33] dark:border-[#34d399]">
            <p className="font-semibold text-[#14231f] dark:text-[#e4efe9] mb-1">
              مرحباً بك في «محراب البيان»
            </p>
            <p className="text-[11.5px] text-[#4b5e57] dark:text-[#9db3ab]">
              تهدف هذه المنصة إلى خدمة لغة الضاد وتيسير علوم النحو والصرف والبلاغة والتعبير للأكاديميين والطلاب وعشاق الفصاحة باستخدام تقنيات الذكاء الاصطناعي المتقدمة.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-[#13221e] dark:text-[#e6f2ed] flex items-center gap-1.5 text-xs sm:text-sm">
              <FileText className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
              <span>1. الغرض التعليمي والأكاديمي</span>
            </h3>
            <p className="text-[#3c4f49] dark:text-[#a8beba] text-[11.5px] sm:text-xs">
              تُقدّم التحليلات النحوية والجداول الإعرابية والشروح البلاغية لأغراض تعليمية وإرشادية وتدريبية. المنصة أداة معينة للدارسين والباحثين وليست بديلاً عن مراجعة أمهات كتب التراث والمعاجم المعتمدة عند إعداد البحوث المحكّمة.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-[#13221e] dark:text-[#e6f2ed] flex items-center gap-1.5 text-xs sm:text-sm">
              <AlertCircle className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
              <span>2. دقة المعالجة وضبط الألفاظ</span>
            </h3>
            <p className="text-[#3c4f49] dark:text-[#a8beba] text-[11.5px] sm:text-xs">
              يبذل محرك الذكاء الاصطناعي أقصى طاقته في تخريج الإعراب وفق القواعد النحوية المعتمدة (البصرية والكوفية) وضبط الكلمات بالشكل التام. وفي حالات التعدد الدلالي أو الأوجه الجائزة، يُستحسن النظر في السياق الكامل للنص.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-[#13221e] dark:text-[#e6f2ed] flex items-center gap-1.5 text-xs sm:text-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
              <span>3. الخصوصية وحفظ البيانات</span>
            </h3>
            <p className="text-[#3c4f49] dark:text-[#a8beba] text-[11.5px] sm:text-xs">
              جميع جلسات المحادثة والمصطلحات المحفوظة في «معجمي الخاص» ومفضلتك تُخزّن محلياً وبأمان تام داخل متصفح جهازك. ولا نقوم ببيع أو استغلال أي بيانات أو نصوص يرفعها المستخدم لأي طرف ثالث.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-[#13221e] dark:text-[#e6f2ed] flex items-center gap-1.5 text-xs sm:text-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
              <span>4. حقوق الملكية الفكرية والاستخدام العادل</span>
            </h3>
            <p className="text-[#3c4f49] dark:text-[#a8beba] text-[11.5px] sm:text-xs">
              يحق للمستخدم نسخ، تصدير، طباعة، ومشاركة نتائج الإعراب والشروح البلاغية لأغراض الدراسة والتدريس ونشر المعرفة اللغوية، مع الحفاظ على روح الأمانة العلمية.
            </p>
          </div>
        </div>

        {/* Interactive Agreement Form */}
        <form
          onSubmit={handleSaveAgreement}
          className="pt-3.5 mt-3 border-t border-[#e5d8c1] dark:border-[#21352f] flex-shrink-0"
        >
          <label className="flex items-start gap-2.5 mb-4 cursor-pointer select-none">
            <input
              type="checkbox"
              id="agree-terms-checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#0d3a33] dark:text-[#6ee7b7] focus:ring-0 focus:outline-none cursor-pointer"
            />
            <span className="text-xs text-[#20322d] dark:text-[#c4d6d0] font-medium leading-relaxed">
              لقد قرأت وثيقة الشروط والأحكام وميثاق الاستخدام وأوافق على الالتزام بضوابط الاستخدام التعليمي الرصين لمحراب البيان.
            </span>
          </label>

          <div className="flex items-center justify-between gap-3">
            <div className="text-[11px] text-[#697c74] dark:text-[#7f958d]">
              {hasAgreed ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  حالة الموافقة: مُفعّلة
                </span>
              ) : (
                <span>يرجى تأكيد موافقتك للمتابعة</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isMandatoryGate && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl border border-[#ded0b9] dark:border-[#273d36] text-xs font-semibold text-[#445650] dark:text-[#b4c8c1] hover:bg-[#ebdcc6] dark:hover:bg-[#1e332d] cursor-pointer"
                >
                  إغلاق
                </button>
              )}
              <button
                type="submit"
                id="submit-terms-agreement-btn"
                disabled={!hasAgreed}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d3a33] hover:bg-[#144d44] disabled:bg-[#d5c9b4] dark:disabled:bg-[#1f312b] text-white disabled:text-[#837865] dark:disabled:text-[#4d6059] text-xs font-bold cursor-pointer disabled:cursor-not-allowed shadow-xs transition-all active:scale-95"
              >
                {showSavedToast ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>تم حفظ الإقرار والمتابعة...</span>
                  </>
                ) : isMandatoryGate ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    <span>الموافقة وفتح محراب البيان</span>
                  </>
                ) : (
                  <span>حفظ ومتابعة</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
