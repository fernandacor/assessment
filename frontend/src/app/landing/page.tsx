"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TypingText from './typing';
import { motion } from "framer-motion";

const transition = {
  duration: 0.8,
  delay: 0.5,
  ease: [0, 0.71, 0.2, 1.01],
};

const Landing = () => {
  const [typingDone, setTypingDone] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Hide banner after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Hide banner on spacebar press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setShowBanner(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-500 to-blue-400 p-10 flex flex-col">
  {/* Top banner */}
  {showBanner && (
    <div className="w-full flex justify-center mb-4">
      <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline text-xs">Press Space to skip</span>
        <button
          onClick={() => setShowBanner(false)}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          aria-label="Close"
        >
        </button>
      </div>
    </div>
  )}

  {/* Centered content */}
  <div className="flex-1 flex justify-center items-center">
    <div className="w-max flex flex-col items-center">
      <TypingText onTypingDone={() => setTypingDone(true)} />

      {typingDone && (
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="text-4xl font-bold text-white mt-6"
        >
          Do you have a social media addiction?
        </motion.h1>
      )}

      {typingDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <Link href="/signin" passHref>
            <button className="mt-10 px-6 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
              Take the quiz
            </button>
          </Link>
        </motion.div>
      )}
    </div>
  </div>
</div>

  );
};

export default Landing;
