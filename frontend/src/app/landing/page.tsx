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
    <div className="min-h-screen bg-gray-300/50 pt-10 flex flex-col">

      {/*NavBar */}
      <div className="w-full text-[#254664] flex ml-45 gap-50 font-mono text-sm">
        <a href="/signup" className="hover:underline hover:text-[#355C7D] transition-colors">Registrarse</a>
        <a href="/signin" className="hover:underline hover:text-[#355C7D] transition-colors">Iniciar Sesión</a>
      </div>


      {/* Top banner */}
      {showBanner && (
        <div className="w-full flex justify-center mb-4">
          <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline text-xs">Oprime Espacio para omitir</span>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              aria-label="Close"
            />
          </div>
        </div>
      )}

<div className="flex flex-1 justify-center items-center gap-24">
  {/* Left Column: Typing Text */}
  <div className="w-1/2 max-w-xl">
    <TypingText />
  </div>

  {/* Right Column: Question + Button with Blob Background */}
  <div className="w-1/2 max-w-md relative">
    {/* Blobs */}
    <div className="absolute top-.5 bottom-5 -left-6 w-96 h-96 bg-[#355C7D] rounded-full opacity-70 mix-blend-multiply filter blur-xl z-0"></div>
    <div className="absolute top-.5 -right-6 w-96 h-96 bg-[#A8E6CF] rounded-full opacity-70 mix-blend-multiply filter blur-xl z-0"></div>
    <div className="absolute -bottom-8 left-28 w-96 h-96 bg-[#949ac4] rounded-full opacity-70 mix-blend-multiply filter blur-xl z-0"></div>

    {/* Foreground content */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="relative z-10 bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-lg text-center"
    >
      <h1 className="text-7xl font-bold text-white mb-6">
        ¿Tienes una adicción a las redes sociales?
      </h1>
      <Link href="/signin" passHref>
        <button className="px-6 py-3 bg-gray-200 text-black rounded-lg shadow hover:bg-[#355C7D] hover:text-white transition-colors">
          Tomar el test
        </button>
      </Link>
    </motion.div>
  </div>
</div>



<footer className="bg-[#355C7D]/70 text-white w-full shadow-inner ">
  <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
    
    {/* Logo and Brand */}
    <div className="flex items-center">
      <img src="/LOGO.png" className="h-12 ml-10 p-2" alt="Dinamita Dev" />
      <span className="text-md font-light mt-2 mr-5" >Dinamita Dev</span>
    </div>
    
    {/* Copyright */}
    <div className="text-sm text-right text-gray-200 px-5">
      © 2025 <a href="https://github.com/fernandacor/assessment" className="underline hover:text-white">Dinamita Dev</a>. Todos los derechos reservados.
    </div>
    
  </div>
</footer>




</div>
  );
};

export default Landing;
