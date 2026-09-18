import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryTabs } from './components/CategoryTabs';
import { HeroCard } from './components/HeroCard';
import { ChatInput } from './components/ChatInput';
import { ResultCard } from './components/ResultCard';
import { CameraModal } from './components/CameraModal';
import { AuthModal } from './components/AuthModal';
import { Sidebar } from './components/Sidebar';
import { ArticlesView } from './components/ArticlesView';
import { MyGlossaryView } from './components/MyGlossaryView';
import { TermsModal } from './components/TermsModal';
import { Footer } from './components/Footer';
import { AppMode, AttachedImage, ChatMessage, UserProfile, MainView } from './types';
import { Loader2, AlertCircle, Square } from 'lucide-react';
import { cleanArabicAnswer } from './utils/textCleaner';

const STORAGE_KEY_HISTORY = 'mihrab_bayan_history_v1';
const STORAGE_KEY_USER = 'mihrab_bayan_user_v1';
const STORAGE_KEY_THEME = 'mihrab_bayan_theme_v1';

export default function App() {
  const [mode, setMode] = useState<AppMode>('grammar');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [activeMessage, setActiveMessage] = useState<ChatMessage | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Attached image state in input
  const [attachedImage, setAttachedImage] = useState<AttachedImage | null>(null);

  // Draft text in question box (for suggestions & typing)
  const [draftText, setDraftText] = useState<string>('');

  // Modals state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);

  // Mandatory terms on initial site load if not yet accepted
  const [isTermsMandatory, setIsTermsMandatory] = useState<boolean>(() => {
    return localStorage.getItem('mihrab_terms_accepted_v1') !== 'true';
  });
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(() => {
    return localStorage.getItem('mihrab_terms_accepted_v1') !== 'true';
  });

  const [currentView, setCurrentView] = useState<MainView>('chat');

  const abortControllerRef = useRef<AbortController | null>(null);

  // Dark mode state - defaults to false (light mode matching user screenshots)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved !== null) {
        return saved === 'dark';
      }
      // Default to false (Warm Light Mode as shown in design images)
      return false;
    }
    return false;
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Apply dark mode class to html document and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // Load user and history from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      }
    } catch (e) {
      console.error('Failed loading storage', e);
    }
  }, []);

  // Save history whenever it updates
  const updateHistory = (newHistory: ChatMessage[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to persist history', e);
    }
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.error('Failed to remove user', e);
    }
  };

  const handleNewChat = () => {
    setActiveMessage(null);
    setAttachedImage(null);
    setErrorMsg(null);
    setDraftText('');
    setIsReadingMode(false);
  };

  const handleStopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleSubmit = async (questionText: string, image?: AttachedImage) => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          question: questionText,
          mode: mode,
          image: image || null,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('Non-JSON response from /api/solve:', text.slice(0, 300));
        throw new Error(
          response.status === 504 || response.status === 502
            ? 'استغرق التحليل وقتاً أطول من المعتاد على الخادم. يرجى المحاولة مجدداً الآن.'
            : 'تعذر الاتصال بخدمة التحليل اللغوي (استجابة غير متوقعة من الخادم). يرجى المحاولة مرة أخرى.'
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(data?.error || 'حدث خطأ أثناء الاتصال بالخادم.');
      }

      const newMsg: ChatMessage = {
        id: 'msg_' + Date.now(),
        mode: mode,
        question: questionText,
        image: image,
        answer: cleanArabicAnswer(data.answer || ''),
        createdAt: new Date().toISOString(),
        starred: false,
      };

      setActiveMessage(newMsg);
      updateHistory([newMsg, ...history]);
      setAttachedImage(null);

      // Scroll to answer smoothly
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('User stopped the response generation');
        return;
      }
      console.error('Solve error:', err);
      setErrorMsg(err.message || 'تعذر استخراج الإجابة. يرجى إعادة المحاولة.');
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleToggleStar = (id: string) => {
    const updated = history.map((m) => {
      if (m.id === id) {
        const isStarred = !m.starred;
        if (activeMessage && activeMessage.id === id) {
          setActiveMessage({ ...activeMessage, starred: isStarred });
        }
        return { ...m, starred: isStarred };
      }
      return m;
    });
    updateHistory(updated);
  };

  const handleDeleteMessage = (id: string) => {
    const updated = history.filter((m) => m.id !== id);
    updateHistory(updated);
    if (activeMessage && activeMessage.id === id) {
      setActiveMessage(null);
      setIsReadingMode(false);
    }
  };

  const handleClearAllHistory = () => {
    updateHistory([]);
    setActiveMessage(null);
    setIsReadingMode(false);
  };

  return (
    <div
      id="app-root"
      className="min-h-screen flex flex-col bg-[#fbf8f1] dark:bg-[#111a18] text-[#1c2925] dark:text-[#e4efe9] transition-colors duration-200"
    >
      {/* Top Navigation Bar */}
      <Navbar
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNewChat={handleNewChat}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        historyCount={history.length}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Main Container with Desktop Sidebar on right + Center Content */}
      <div className="flex-1 flex flex-row w-full max-w-[1600px] mx-auto overflow-hidden">
        {/* Persistent Desktop Sidebar (only in chat view, and hidden in reading mode) */}
        {currentView === 'chat' && !isReadingMode && (
          <Sidebar
            messages={history}
            activeMessageId={activeMessage?.id || null}
            onSelectMessage={(msg) => {
              setActiveMessage(msg);
              setMode(msg.mode);
            }}
            onNewChat={handleNewChat}
            onDeleteMessage={handleDeleteMessage}
            onToggleStar={handleToggleStar}
            isOpenMobile={isHistoryOpen}
            onCloseMobile={() => setIsHistoryOpen(false)}
          />
        )}

        {/* Main Content Area */}
        {currentView === 'articles' ? (
          <main className="flex-1 w-full overflow-y-auto pb-10">
            <ArticlesView
              onBack={() => setCurrentView('chat')}
              onAskQuestion={(q) => {
                setCurrentView('chat');
                handleSubmit(q);
              }}
            />
          </main>
        ) : currentView === 'glossary' ? (
          <main className="flex-1 w-full overflow-y-auto pb-10">
            <MyGlossaryView
              onBack={() => setCurrentView('chat')}
              onAskAboutTerm={(term) => {
                setCurrentView('chat');
                handleSubmit(term);
              }}
            />
          </main>
        ) : (
          <main
            className={`flex-1 flex flex-col min-w-0 mx-auto px-2 sm:px-4 pb-4 overflow-y-auto transition-all duration-300 ${
              isReadingMode ? 'max-w-6xl w-full' : 'max-w-5xl'
            }`}
          >
            {/* Category Pill Switcher (hidden in reading mode for zero distraction) */}
            {!isReadingMode && (
              <CategoryTabs activeMode={mode} onSelectMode={setMode} />
            )}

            {/* Error notification banner if any */}
            {errorMsg && (
              <div className="mx-4 my-2 p-3.5 rounded-2xl bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center justify-between text-red-800 dark:text-red-300 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  onClick={() => setErrorMsg(null)}
                  className="text-xs font-bold underline px-2 py-1 cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            )}

            {/* Dynamic Center View: Either Hero Card OR Active Result */}
            <div className="flex-1 flex flex-col justify-center">
              {!activeMessage ? (
                <HeroCard
                  mode={mode}
                  onSelectPrompt={(promptText) => {
                    setDraftText(promptText);
                  }}
                  onDirectSubmit={(promptText) => {
                    handleSubmit(promptText);
                  }}
                />
              ) : (
                <div className="w-full animate-in fade-in duration-300">
                  <ResultCard
                    message={activeMessage}
                    onToggleStar={handleToggleStar}
                    isReadingMode={isReadingMode}
                    onToggleReadingMode={() => setIsReadingMode((prev) => !prev)}
                  />
                </div>
              )}

              {/* Loading Indicator when solving */}
              {isLoading && (
                <div className="max-w-sm sm:max-w-md mx-auto my-4 sm:my-8 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#f5efe3] dark:bg-[#182723] border border-[#e4d9c6] dark:border-[#273d36] text-center shadow-md">
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#0f3e36] dark:text-[#6ee7b7] animate-spin mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-alexandria font-bold text-base sm:text-lg text-[#182622] dark:text-[#e4efe9] mb-1">
                    تحليل لغوي فوري دقيق...
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#5e7169] dark:text-[#8ea59d] font-alexandria mb-3">
                    يجري تدبّر القواعد النحوية والصرفية ومواطن البيان
                  </p>
                  <button
                    id="center-stop-response-btn"
                    onClick={handleStopResponse}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>إيقاف الاستجابة</span>
                  </button>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Bottom Rounded Input Box matching نم.PNG */}
            <div className="sticky bottom-0 z-20 bg-gradient-to-t from-[#fbf8f1] via-[#fbf8f1]/95 to-transparent dark:from-[#111a18] dark:via-[#111a18]/95 pt-2">
              <ChatInput
                mode={mode}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                onStopResponse={handleStopResponse}
                onOpenCamera={() => setIsCameraOpen(true)}
                attachedImage={attachedImage}
                onClearImage={() => setAttachedImage(null)}
                onSelectImage={(img) => setAttachedImage(img)}
                draftText={draftText}
                onDraftChange={setDraftText}
              />
            </div>
          </main>
        )}
      </div>

      {/* Global Copyright & Legal Footer */}
      {!isReadingMode && (
        <Footer
          onNavigate={(view) => setCurrentView(view)}
          onOpenTerms={() => {
            setIsTermsMandatory(false);
            setIsTermsOpen(true);
          }}
        />
      )}

      {/* Terms and Conditions Form Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        isMandatoryGate={isTermsMandatory}
        onAccepted={() => {
          setIsTermsMandatory(false);
        }}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => setAttachedImage(img)}
        onSwitchToUpload={() => {
          const input = document.getElementById('image-file-input') as HTMLInputElement;
          input?.click();
        }}
      />

      {/* Auth Modal (Login / Register / Profile) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        historyCount={history.length}
      />
    </div>
  );
}
