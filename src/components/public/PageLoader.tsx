'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds loading delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-bg"
          >
            {/* Spinning/Pulsing Creative Loader */}
            <div className="relative flex flex-col items-center justify-center space-y-5">
              <motion.div
                animate={{
                  rotate: 360,
                  borderRadius: ["25%", "50%", "25%"],
                }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="h-16 w-16 border-2 border-primary border-dashed"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex items-center gap-2 text-sm font-mono tracking-[0.3em] uppercase text-text-primary select-none"
              >
                <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                TECTOFLOW
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </>
  );
}
