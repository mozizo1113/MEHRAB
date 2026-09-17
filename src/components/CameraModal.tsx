import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Upload } from 'lucide-react';
import { AttachedImage } from '../types';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (image: AttachedImage) => void;
  onSwitchToUpload: () => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  onSwitchToUpload,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedDataUrl(null);
      setErrorMsg(null);
      return;
    }

    startCamera(facingMode);

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async (mode: 'user' | 'environment') => {
    stopCamera();
    setErrorMsg(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('المتصفح لا يدعم الوصول المباشر للكاميرا.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setErrorMsg(
        'تعذر تشغيل الكاميرا. يرجى منح إذن الكاميرا للمتصفح أو استخدام خيار رفع صورة من الجهاز.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedDataUrl(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedDataUrl(null);
    startCamera(facingMode);
  };

  const handleConfirm = () => {
    if (capturedDataUrl) {
      onCapture({
        dataUrl: capturedDataUrl,
        mimeType: 'image/jpeg',
        name: `صورة_ملتقطة_${Date.now()}.jpg`,
      });
      onClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#fbf8f1] dark:bg-[#162320] rounded-3xl border border-[#ded5c2] dark:border-[#2b413a] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee6d6] dark:border-[#22352f]">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#0f3e36] dark:text-[#6ee7b7]" />
            <h3 className="font-amiri font-bold text-lg text-[#162521] dark:text-[#e2eee9]">
              التقاط صورة للسؤال النحوي أو الأدبي
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#6c7f77] hover:text-[#182622] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport / Preview */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-white">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <p className="text-sm font-medium mb-4">{errorMsg}</p>
              <button
                onClick={() => {
                  onClose();
                  onSwitchToUpload();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>رفع صورة من الجهاز بدلاً من ذلك</span>
              </button>
            </div>
          ) : capturedDataUrl ? (
            <img
              src={capturedDataUrl}
              alt="صورة ملتقطة"
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Overlay framing lines */}
              <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                  وجّه الكاميرا نحو السؤال بوضوح
                </span>
              </div>
            </>
          )}

          {/* Hidden canvas for drawing frame */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-[#f5eee2] dark:bg-[#131d1b] flex items-center justify-between">
          {capturedDataUrl ? (
            <>
              <button
                onClick={handleRetake}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#ded5c2] dark:border-[#2b413a] text-xs sm:text-sm font-semibold text-[#273933] dark:text-[#c4d6d0] hover:bg-[#eae1cf] dark:hover:bg-[#1a2b26] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة الالتقاط</span>
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0f3e36] hover:bg-[#175247] text-white text-xs sm:text-sm font-semibold shadow-md dark:bg-[#1b554b] transition-all"
              >
                <Check className="w-4 h-4" />
                <span>استخدام هذه الصورة</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleFacingMode}
                disabled={!!errorMsg}
                title="تبديل الكاميرا (الأمامية / الخلفية)"
                className="p-2.5 rounded-xl border border-[#ded5c2] dark:border-[#2b413a] text-[#475a53] dark:text-[#b4c8c1] hover:bg-[#eae1cf] dark:hover:bg-[#1a2b26] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleCapture}
                disabled={!!errorMsg}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f3e36] hover:bg-[#175247] text-white font-bold text-sm shadow-lg dark:bg-[#1b554b] transition-all active:scale-95"
              >
                <div className="w-4 h-4 rounded-full border-2 border-white bg-red-500 animate-pulse" />
                <span>التقاط الصورة الآن</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSwitchToUpload();
                }}
                className="text-xs text-[#0f3e36] dark:text-[#6ee7b7] font-semibold underline p-2"
              >
                رفع ملف
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
