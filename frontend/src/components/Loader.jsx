import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ finishLoading }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Disable scrolling when loader is active
    document.body.style.overflow = 'hidden';

    // Show the brand name text after the stroke animation starts
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 600);

    // End loading after the entire sequence completes
    const finishTimer = setTimeout(() => {
      if (typeof finishLoading === 'function') {
        finishLoading();
      }
    }, 2500);

    return () => {
      // Re-enable scrolling when loader is unmounted
      document.body.style.overflow = '';
      clearTimeout(textTimer);
      clearTimeout(finishTimer);
    };
  }, [finishLoading]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
      }}
      className="fixed inset-0 z-[9999] bg-[#0c0c0e] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,252,8,0.05)_0%,transparent_65%)] pointer-events-none" />

      {/* Monogram drawing container */}
      <div className="relative z-10 flex flex-col items-center">
        <svg viewBox="0 0 200 200" className="w-28 h-28 sm:w-36 sm:h-36">
          {/* Outer Circle Drawing */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="#e8fc08"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-svg-circle"
          />
          {/* Monogram B Shape Drawing */}
          <path
            d="M 80 60 L 80 140 M 80 60 L 115 60 C 128 60, 128 95, 115 95 M 80 95 L 115 95 C 128 95, 128 140, 115 140 L 80 140"
            fill="none"
            stroke="#e8fc08"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-svg-path"
          />
        </svg>

        {/* Brand name fading/sliding in */}
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 15, letterSpacing: '0.2em' }}
              animate={{
                opacity: 1,
                y: 0,
                letterSpacing: '0.4em',
                transition: { duration: 0.8, ease: 'easeOut' }
              }}
              className="mt-6 flex flex-col items-center"
            >
              <h1 className="font-logo text-xl sm:text-2xl font-bold text-zinc-100 uppercase select-none tracking-[0.4em] ml-[0.4em]">
                BHONDU
              </h1>
              <p className="text-[9px] text-[#e8fc08] tracking-[0.55em] ml-[0.55em] mt-2 select-none uppercase font-semibold">
                Built Different
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Futuristic status line loading indicator at the bottom */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-48 h-[1px] bg-zinc-800 overflow-hidden">
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
          className="absolute top-0 bottom-0 w-24 bg-[#e8fc08]"
        />
      </div>
    </motion.div>
  );
};

export default Loader;
