"use client";

import React from 'react'
import Link from 'next/link'
import TypingText from './typing';
import { motion } from "motion/react"

const transition = {
  duration: 0.8,
  delay: 0.5,
  ease: [0, 0.71, 0.2, 1.01],
}

const Landing = () => {
  const [typingDone, setTypingDone] = React.useState(false);

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-tr from-green-500 to-blue-400 p-10 items-center">
      <div className="w-max flex flex-col items-center">
        <TypingText onTypingDone={() => setTypingDone(true)} />
        {typingDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <Link href="/auth/signin" passHref>
              <button className="mt-10 px-6 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Landing;
