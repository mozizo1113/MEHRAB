import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Emblem3DProps {
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const Emblem3D: React.FC<Emblem3DProps> = ({ size = 'md', interactive = true }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position coordinates for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for fluid 3D movement
  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [18, -18]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-18, 18]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const xPct = clientX / rect.width - 0.5;
    const yPct = clientY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative ${dimensions} flex items-center justify-center cursor-pointer select-none`}
      style={{ perspective: 900 }}
    >
      <motion.div
        style={{
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: isHovered ? -4 : [0, -6, 0],
        }}
        transition={{
          y: {
            repeat: isHovered ? 0 : Infinity,
            duration: 3.5,
            ease: 'easeInOut',
          },
        }}
        className="w-full h-full relative flex items-center justify-center"
      >
        {/* Layer 1: Ambient golden/emerald 3D back-glow */}
        <motion.div
          animate={{
            scale: [0.95, 1.08, 0.95],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-600/30 via-amber-500/30 to-teal-400/20 blur-lg -z-10"
          style={{ transform: 'translateZ(-20px)' }}
        />

        {/* Layer 2: Outer 3D Carved Octagram / Islamic Star Ring */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
          className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-amber-600/30 dark:border-amber-400/30 border-dashed"
          style={{ transform: 'translateZ(10px)' }}
        />

        {/* Layer 3: Solid Medallion Base with Metallic Bevel */}
        <div
          className="w-full h-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#f5ede0] via-[#e8ddc9] to-[#d6c7ac] dark:from-[#1b2f29] dark:via-[#142420] dark:to-[#0d1815] border-2 border-[#dfd2be] dark:border-[#2f4941] shadow-lg flex items-center justify-center relative overflow-hidden"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Subtle light sheen highlight */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 to-transparent rotate-45 pointer-events-none" />

          {/* Layer 4: Deep 3D Arabic Letter "ض" and Open Book Geometry */}
          <div
            className="relative flex items-center justify-center text-[#0f3e36] dark:text-amber-300"
            style={{ transform: 'translateZ(35px)' }}
          >
            <svg
              className="w-8 h-8 sm:w-11 sm:h-11 drop-shadow-md"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Islamic Book outline */}
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <path d="M9 7h7" />
              <path d="M9 11h5" />
              <circle cx="12" cy="15" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Layer 5: Floating Mini Crown / Sparkle on Top-Right */}
        <motion.div
          animate={{
            scale: [0.9, 1.2, 0.9],
            rotate: [0, 15, -15, 0],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-[9px] text-[#0f3e36] font-bold shadow-md"
          style={{ transform: 'translateZ(45px)' }}
        >
          ✦
        </motion.div>
      </motion.div>
    </div>
  );
};
