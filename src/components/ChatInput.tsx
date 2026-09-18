import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Image as ImageIcon, Camera, Upload, X, Loader2, Mic, MicOff, Square } from 'lucide-react';
import { AppMode, AttachedImage } from '../types';

interface ChatInputProps {
  mode: AppMode;
  onSubmit: (question: string, image?: AttachedImage) => void;
  isLoading: boolean;
  onStopResponse?: () => void;
  onOpenCamera: () => void;
  attachedImage: AttachedImage | null;
  onClearImage: () => void;
  onSelectImage: (img: AttachedImage) => void;
  draftText?: string;
  onDraftChange?: (val: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  mode,
  onSubmit,
  isLoading,
  onStopResponse,
  onOpenCamera,
  attachedImage,
  onClearImage,
  onSelectImage,
  draftText = '',
  onDraftChange,
}) => {
  const [inputText, setInputText] = useState(draftText);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');

  // Sync with draftText when updated from suggestions
  useEffect(() => {
    if (draftText !== undefined && draftText !== '') {
      setInputText(draftText);
      if (textareaRef.current) {
        textareaRef.current.focus();
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(draftText.length, draftText.length);
          }
        }, 50);
      }
    }
  }, [draftText]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Close image menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowImageMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputText]);

  // Speech-to-Text handler
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setSpeechFeedback(null);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechFeedback('المتصفح لا يدعم ميزة الإملاء الصوتي المباشر');
      setTimeout(() => setSpeechFeedback(null), 3000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      baseTextRef.current = inputText;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechFeedback('جاري الاستماع... تكلّم الآن');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        const trimmed = currentTranscript.trim();
        if (trimmed) {
          const prefix = baseTextRef.current.trim() ? `${baseTextRef.current.trim()} ` : '';
          const fullText = `${prefix}${trimmed}`;
          setInputText(fullText);
          onDraftChange?.(fullText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechFeedback('يرجى السماح بالوصول إلى الميكروفون');
        } else if (event.error === 'no-speech') {
          setSpeechFeedback('لم يتم التقاط صوت، حاول مجدداً');
        } else {
          setSpeechFeedback(null);
        }
        setIsListening(false);
        setTimeout(() => setSpeechFeedback(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setSpeechFeedback(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
      setSpeechFeedback(null);
    }
  };

  const getPlaceholder = () => {
    if (isListening) {
      return 'تحدّث الآن، سيتحول صوتك إلى كلام هنا تلقائياً...';
    }
    switch (mode) {
      case 'grammar':
      case 'grammar_rhetoric':
        return 'اكتب سؤالك في النحو أو الصرف أو الإعراب...';
      case 'rhetoric':
        return 'اكتب سؤالك في البلاغة أو كلمة معقدة لشرح معناها وظلالها البيانية...';
      case 'composition':
        return 'اكتب موضوع التعبير المطلوب أو عناصره وأفكاره...';
      case 'literature':
        return 'اكتب النص أو الأبيات الشعرية المراد تحليلها وشرحها...';
      default:
        return 'اكتب سؤالك هنا...';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (isLoading) return;
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
    const trimmed = inputText.trim();
    if (!trimmed && !attachedImage) return;

    onSubmit(trimmed, attachedImage || undefined);
    setInputText('');
    baseTextRef.current = '';
    onDraftChange?.('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onSelectImage({
          dataUrl,
          mimeType: file.type || 'image/jpeg',
          name: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
    setShowImageMenu(false);
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-3 pb-1.5 sm:pb-2.5 pt-0.5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="image-file-input"
      />

      {/* Main Rounded Input Box matching نم.PNG - ultra-compact & refined */}
      <div className="relative rounded-xl sm:rounded-2xl bg-[#f5efe3] dark:bg-[#162420] border border-[#e3d8c4] dark:border-[#253933] shadow-xs focus-within:border-[#0d3a33]/50 dark:focus-within:border-[#6ee7b7]/50 focus-within:shadow-xs transition-all p-1.5 sm:p-2">
        {/* Attached image preview banner if present */}
        {attachedImage && (
          <div className="mb-1 sm:mb-1.5 flex items-center gap-1.5 p-1 bg-[#ece4d2] dark:bg-[#1d2f2a] rounded-lg border border-[#ded4c0] dark:border-[#2b413a] w-fit max-w-full">
            <img
              src={attachedImage.dataUrl}
              alt="صورة السؤال المرفقة"
              className="w-7 h-7 sm:w-8 sm:h-8 object-cover rounded-md border border-black/10 flex-shrink-0"
            />
            <div className="text-right min-w-0">
              <p className="text-[10.5px] font-medium text-[#1c2925] dark:text-[#d3e3de] truncate max-w-[120px] sm:max-w-[200px]">
                {attachedImage.name || 'صورة السؤال'}
              </p>
              <p className="text-[8.5px] text-[#0d3a33] dark:text-[#6ee7b7]">
                جاهزة للتحليل والقراءة
              </p>
            </div>
            <button
              onClick={onClearImage}
              title="إزالة الصورة"
              className="p-0.5 text-[#6b7c75] hover:text-red-500 rounded-full hover:bg-black/5 transition-colors mr-0.5 flex-shrink-0 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Voice Speech feedback banner if active */}
        {speechFeedback && (
          <div className="mb-1.5 flex items-center justify-between gap-1.5 px-2.5 py-1 bg-[#ede4d2] dark:bg-[#1d2f2a] rounded-lg border border-[#ded4c0] dark:border-[#2b413a] text-[11px] text-[#0d3a33] dark:text-[#6ee7b7] animate-in fade-in">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-amber-500'}`} />
              <span className="font-medium">{speechFeedback}</span>
            </div>
            {isListening && (
              <button
                type="button"
                onClick={toggleListening}
                className="text-[10px] underline font-bold text-red-600 dark:text-red-400 cursor-pointer"
              >
                إيقاف
              </button>
            )}
          </div>
        )}

        {/* Textarea with smaller, refined font */}
        <textarea
          ref={textareaRef}
          id="question-input-textarea"
          rows={1}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            onDraftChange?.(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          disabled={isLoading}
          className="w-full bg-transparent resize-none outline-none text-[#182622] dark:text-[#e4efe9] placeholder-[#82928c] dark:placeholder-[#647972] text-[12.5px] sm:text-[13.5px] font-alexandria leading-relaxed min-h-[28px] sm:min-h-[32px] max-h-[120px]"
        />

        {/* Bottom controls bar WITHOUT dividing line */}
        <div className="flex items-center justify-between mt-0.5 pt-0.5">
          {/* Submit or Stop button on the left (in RTL) */}
          {isLoading && onStopResponse ? (
            <button
              id="stop-response-btn"
              type="button"
              onClick={onStopResponse}
              title="إيقاف الاستجابة فوراً"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xs text-[11px] font-bold transition-all active:scale-95 cursor-pointer animate-pulse"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>إيقاف الاستجابة</span>
            </button>
          ) : (
            <button
              id="submit-question-btn"
              onClick={handleSend}
              disabled={isLoading || (!inputText.trim() && !attachedImage)}
              title="إرسال السؤال (Enter)"
              className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                isLoading || (!inputText.trim() && !attachedImage)
                  ? 'bg-[#ded5c2] dark:bg-[#253933] text-[#8e8574] dark:text-[#526a62] cursor-not-allowed'
                  : 'bg-[#0d3a33] hover:bg-[#134d44] text-white dark:bg-[#1b554b] dark:hover:bg-[#236b5e] shadow-2xs'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <ArrowUp className="w-3.5 h-3.5 stroke-[2.2]" />
              )}
            </button>
          )}

          {/* Action buttons on the right (in RTL): Voice Recording + Image Button */}
          <div className="flex items-center gap-1.5">
            {/* Voice Recording / Speech-to-Text Button */}
            <button
              id="voice-input-btn"
              type="button"
              onClick={toggleListening}
              title={isListening ? 'إيقاف التسجيل الصوتي' : 'تسجيل صوتي وتحويله إلى نص في الصندوق تلقائياً'}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all text-[10.5px] sm:text-[11.5px] font-medium min-h-[25px] sm:min-h-[27px] cursor-pointer ${
                isListening
                  ? 'border-red-400/80 bg-red-500/15 text-red-700 dark:text-red-300 animate-pulse shadow-xs font-semibold'
                  : 'border-[#ded5c2] dark:border-[#2b413a] bg-[#ede6d8] dark:bg-[#1a2b26] text-[#334640] dark:text-[#bad0c8] hover:bg-[#e4dcce] dark:hover:bg-[#223731] active:scale-95'
              }`}
            >
              <span>{isListening ? 'استماع...' : 'تسجيل صوتي'}</span>
              {isListening ? (
                <MicOff className="w-3 h-3 text-red-600 dark:text-red-400" />
              ) : (
                <Mic className="w-3 h-3 text-[#0d3a33] dark:text-[#6ee7b7]" />
              )}
            </button>

            {/* Image button on the right */}
            <div className="relative" ref={menuRef}>
              <button
                id="attach-image-btn"
                type="button"
                onClick={() => setShowImageMenu((prev) => !prev)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#ded5c2] dark:border-[#2b413a] bg-[#ede6d8] dark:bg-[#1a2b26] text-[#334640] dark:text-[#bad0c8] hover:bg-[#e4dcce] dark:hover:bg-[#223731] active:scale-95 transition-colors text-[10.5px] sm:text-[11.5px] font-medium min-h-[25px] sm:min-h-[27px] cursor-pointer"
              >
                <span>صورة السؤال</span>
                <ImageIcon className="w-3 h-3 text-[#0d3a33] dark:text-[#6ee7b7]" />
              </button>

            {/* Popover options */}
            {showImageMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-44 sm:w-48 bg-[#faf6ee] dark:bg-[#162320] rounded-2xl border border-[#ded5c2] dark:border-[#2b413a] shadow-xl p-1 z-40 animate-in fade-in zoom-in-95 duration-150">
                <button
                  id="upload-file-option-btn"
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs rounded-xl text-[#2a3c36] dark:text-[#c4d6d0] hover:bg-[#efe7d7] dark:hover:bg-[#1e312b] transition-colors text-right cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
                  <span>رفع صورة من الجهاز</span>
                </button>

                <button
                  id="camera-capture-option-btn"
                  type="button"
                  onClick={() => {
                    setShowImageMenu(false);
                    onOpenCamera();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs rounded-xl text-[#2a3c36] dark:text-[#c4d6d0] hover:bg-[#efe7d7] dark:hover:bg-[#1e312b] transition-colors text-right cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#0d3a33] dark:text-[#6ee7b7]" />
                  <span>التقاط صورة بالكاميرا</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
