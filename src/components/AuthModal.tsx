import React, { useState } from 'react';
import { X, LogIn, UserPlus, LogOut, Check, User, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  historyCount: number;
}

const AVATARS = [
  { id: '1', emoji: '📜', title: 'سيبويه (إمام النحاة)' },
  { id: '2', emoji: '🖋️', title: 'ابن جنّي (عالم الصرف والاشتقاق)' },
  { id: '3', emoji: '👑', title: 'المتنبي (شاعر العربية)' },
  { id: '4', emoji: '📖', title: 'الجاحظ (رائد البيان والوضوح)' },
  { id: '5', emoji: '🌸', title: 'الخنساء (شاعرة العرب)' },
  { id: '6', emoji: '🎓', title: 'باحث لغوي معاصر' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  historyCount,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].emoji);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Lookup or generate user
    const user: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0] || 'طالب البيان',
      email: email.trim(),
      avatar: selectedAvatar,
      createdAt: new Date().toISOString(),
    };

    onLogin(user);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('يرجى ملء كافة البيانات لتسجيل حسابك الجديد');
      return;
    }

    const user: UserProfile = {
      id: 'usr_' + Date.now().toString(36),
      name: name.trim(),
      email: email.trim(),
      avatar: selectedAvatar,
      createdAt: new Date().toISOString(),
    };

    onLogin(user);
    onClose();
  };

  const handleQuickDemo = (roleName: string, avatarEmoji: string) => {
    const demoUser: UserProfile = {
      id: 'demo_' + Date.now(),
      name: roleName,
      email: `${roleName.replace(/\s+/g, '')}@bayan.ai`,
      avatar: avatarEmoji,
      createdAt: new Date().toISOString(),
    };
    onLogin(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#fbf8f1] dark:bg-[#162320] rounded-3xl border border-[#ded5c2] dark:border-[#2b413a] shadow-2xl overflow-hidden p-6 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full text-[#6b7d75] hover:text-[#182622] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          /* Profile view when logged in */
          <div className="text-center py-2">
            <div className="w-20 h-20 rounded-2xl bg-[#efe7d7] dark:bg-[#1f332d] border border-[#ded4c0] dark:border-[#2f4941] flex items-center justify-center text-4xl mx-auto mb-3 shadow-inner">
              {currentUser.avatar}
            </div>
            <h3 className="font-amiri font-bold text-xl text-[#182622] dark:text-[#e2eee9]">
              {currentUser.name}
            </h3>
            <p className="text-xs text-[#63766f] dark:text-[#8ea59d] mb-5">
              {currentUser.email}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-[#f4ece0] dark:bg-[#1a2b26] rounded-2xl border border-[#e2d7c4] dark:border-[#273d36]">
                <span className="block text-xl font-bold font-mono text-[#0f3e36] dark:text-[#6ee7b7]">
                  {historyCount}
                </span>
                <span className="text-xs text-[#5c6e68] dark:text-[#90a79f]">
                  الأسئلة المحفوظة
                </span>
              </div>
              <div className="p-3 bg-[#f4ece0] dark:bg-[#1a2b26] rounded-2xl border border-[#e2d7c4] dark:border-[#273d36]">
                <div className="flex items-center justify-center gap-1 text-[#0f3e36] dark:text-[#6ee7b7] mb-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs text-[#5c6e68] dark:text-[#90a79f]">
                  عضوية مفعلة
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        ) : (
          /* Login / Register tabs */
          <div>
            <div className="text-center mb-5">
              <h3 className="font-amiri font-bold text-2xl text-[#182622] dark:text-[#e4efe9] mb-1">
                مرحباً بك في محراب البيان
              </h3>
              <p className="text-xs text-[#62756e] dark:text-[#8ea59d]">
                سجّل دخولك لحفظ سجل استشاراتك والرجوع إلى إعراب نصوصك لاحقاً
              </p>
            </div>

            {/* Tabs toggle */}
            <div className="flex rounded-xl bg-[#eee7d8] dark:bg-[#1a2b26] p-1 mb-5 border border-[#ded5c2] dark:border-[#263c35]">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError('');
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  tab === 'login'
                    ? 'bg-[#0f3e36] text-white shadow-sm dark:bg-[#1b554b]'
                    : 'text-[#485a54] dark:text-[#a2b7b0] hover:text-[#0f3e36]'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError('');
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  tab === 'register'
                    ? 'bg-[#0f3e36] text-white shadow-sm dark:bg-[#1b554b]'
                    : 'text-[#485a54] dark:text-[#a2b7b0] hover:text-[#0f3e36]'
                }`}
              >
                حساب جديد
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs text-right font-medium">
                {error}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#30413b] dark:text-[#c4d6d0] mb-1 text-right">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4ece0] dark:bg-[#1a2b26] border border-[#ded4c1] dark:border-[#2b413a] text-sm text-[#182622] dark:text-white outline-none focus:border-[#0f3e36] text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#30413b] dark:text-[#c4d6d0] mb-1 text-right">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4ece0] dark:bg-[#1a2b26] border border-[#ded4c1] dark:border-[#2b413a] text-sm text-[#182622] dark:text-white outline-none focus:border-[#0f3e36] text-right"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0f3e36] hover:bg-[#185349] text-white font-bold text-sm shadow-sm transition-all"
                >
                  دخول
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#30413b] dark:text-[#c4d6d0] mb-1 text-right">
                    الاسم الكريم
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد شوقي"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4ece0] dark:bg-[#1a2b26] border border-[#ded4c1] dark:border-[#2b413a] text-sm text-[#182622] dark:text-white outline-none focus:border-[#0f3e36] text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#30413b] dark:text-[#c4d6d0] mb-1 text-right">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4ece0] dark:bg-[#1a2b26] border border-[#ded4c1] dark:border-[#2b413a] text-sm text-[#182622] dark:text-white outline-none focus:border-[#0f3e36] text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#30413b] dark:text-[#c4d6d0] mb-1 text-right">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4ece0] dark:bg-[#1a2b26] border border-[#ded4c1] dark:border-[#2b413a] text-sm text-[#182622] dark:text-white outline-none focus:border-[#0f3e36] text-right"
                  />
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-xs font-semibold text-[#30413b] dark:text-[#c4d6d0] mb-1 text-right">
                    اختر رمزك اللغوي
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.emoji)}
                        title={av.title}
                        className={`text-2xl p-1.5 rounded-xl border transition-all ${
                          selectedAvatar === av.emoji
                            ? 'bg-[#0f3e36]/15 border-[#0f3e36] scale-105'
                            : 'border-[#ded4c1] dark:border-[#2b413a] hover:bg-black/5'
                        }`}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0f3e36] hover:bg-[#185349] text-white font-bold text-sm shadow-sm transition-all mt-2"
                >
                  إنشاء الحساب
                </button>
              </form>
            )}

            {/* Quick Demo Login Option */}
            <div className="mt-5 pt-4 border-t border-[#ede4d2] dark:border-[#21352f] text-center">
              <p className="text-[11px] text-[#6a7c75] dark:text-[#889f97] mb-2 font-medium">
                أو الدخول المباشر كباحث ضيف:
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('طالب نحوي', '📜')}
                  className="flex-1 py-1.5 px-2 rounded-xl border border-[#ded4c1] dark:border-[#2b413a] text-xs font-medium text-[#2d403a] dark:text-[#bad0c8] hover:bg-[#ede3d1] dark:hover:bg-[#1d2f2a] transition-colors"
                >
                  📜 طالب نحوي
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('أديب متذوق', '👑')}
                  className="flex-1 py-1.5 px-2 rounded-xl border border-[#ded4c1] dark:border-[#2b413a] text-xs font-medium text-[#2d403a] dark:text-[#bad0c8] hover:bg-[#ede3d1] dark:hover:bg-[#1d2f2a] transition-colors"
                >
                  👑 أديب متذوق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
