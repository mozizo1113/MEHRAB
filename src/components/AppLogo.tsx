import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  subtitle = 'مَكْتَبَتُكَ المَحْفُوظَة',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const titleSize =
    size === 'sm'
      ? 'text-base sm:text-lg'
      : size === 'lg'
      ? 'text-xl sm:text-2xl'
      : 'text-lg sm:text-xl';
  const subSize =
    size === 'sm'
      ? 'text-[10px]'
      : size === 'lg'
      ? 'text-xs sm:text-sm'
      : 'text-[11px] sm:text-xs';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none text-right ${className}`}>
      {/* Intricate Calligraphic Arabesque Emblem matching تت.PNG */}
      <div
        className={`${iconSize} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0a2f29] via-[#0f3e36] to-[#154e44] dark:from-[#0d342d] dark:via-[#164b41] dark:to-[#1a554a] shadow-xs border border-[#c5a059]/40 flex-shrink-0 p-1`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Subtle Outer Arabesque 8-Petal Geometry */}
          <path
            d="M32 3L36.8 12.2L47.1 9.9L46.8 20.5L56.4 24.8L51.2 34L57.8 42.1L48.2 46.5L44.8 56.4L35 52.4L32 61L29 52.4L19.2 56.4L15.8 46.5L6.2 42.1L12.8 34L7.6 24.8L17.2 20.5L16.9 9.9L27.2 12.2L32 3Z"
            stroke="#d4af37"
            strokeWidth="1.2"
            strokeOpacity="0.4"
            fill="none"
          />

          {/* Open Book Base in deep teal with gold edges */}
          <path
            d="M32 44C27 41 20 40 13 41.5V52.5C20 51 27 52 32 55.5C37 52 44 51 51 52.5V41.5C44 40 37 41 32 44Z"
            fill="#08231e"
            stroke="#c5a059"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Book Spine / Pages Lines */}
          <path
            d="M32 44V55.5M16 44.5C21.5 43.5 27 44.5 31 46.5M48 44.5C42.5 43.5 37 44.5 33 46.5"
            stroke="#d4af37"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Center Elegant Calligraphy Pen Nib / Quill rising from book */}
          <path
            d="M32 10C32 10 37 18 37 28C37 32 35 37 32 42C29 37 27 32 27 28C27 18 32 10 32 10Z"
            fill="url(#goldGrad)"
            stroke="#e6ca65"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Pen Slit and Breather Hole */}
          <line x1="32" y1="10" x2="32" y2="27" stroke="#08231e" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="32" cy="27" r="1.8" fill="#08231e" stroke="#c5a059" strokeWidth="0.8" />

          {/* Decorative Calligraphic Flourish Wings */}
          <path
            d="M27 24C22 22 17 26 15 32C19 32 23 30 27 28"
            stroke="#d4af37"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M37 24C42 22 47 26 49 32C45 32 41 30 37 28"
            stroke="#d4af37"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="goldGrad" x1="27" y1="10" x2="37" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f7e199" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#aa8222" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography matching تت.PNG exactly */}
      <div className="flex flex-col justify-center">
        <h1
          className={`${titleSize} font-bold font-amiri text-[#0d342e] dark:text-[#6ee7b7] leading-tight tracking-tight drop-shadow-2xs`}
        >
          محراب البيان
        </h1>
        {showSubtitle && (
          <p
            className={`${subSize} font-alexandria font-normal text-[#526b64] dark:text-[#9eb2ab] leading-snug`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
