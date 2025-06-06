"use client";
import React, { useEffect, useState } from 'react';

interface TypingTextProps {
  onTypingDone?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({ onTypingDone }) => {
  const introText = `Las redes sociales son un conjunto de sitios web y aplicaciones que permiten a individuos y comunidades conectarse, debatir e intercambiar información, y/o producir y compartir contenidos. Hoy en día, debido al rápido avance de la tecnología y al acceso sin esfuerzo a los teléfonos inteligentes, el uso de las redes sociales ha crecido de forma acelerada.\n\n\
Una gran proporción de los usuarios de redes sociales son estudiantes universitarios. El uso de estas redes puede tener efectos tanto positivos como negativos en el rendimiento académico de los estudiantes. Sin embargo, según un estudio de H.C. Woods, los efectos desfavorables de estas redes superan a los positivos. \n`;

  const linkText =
    "\n- El impacto de la adicción a las redes sociales en el rendimiento académico de los estudiantes universitarios a nivel mundial: Un meta-análisis. (2025)";
  const linkUrl = "https://doi.org/10.1016/j.puhip.2025.100584";

  const fullText = introText + " " + linkText;

  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [skip, setSkip] = useState(false);


  useEffect(() => {
    if (skip) {
      setDisplayedText(fullText);
      setIndex(fullText.length);
      
      setTimeout(() => {
        onTypingDone?.();
      }, 100); 
      
      return;
    }

    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        setIndex(index + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText, skip]);

  useEffect(() => {
    if (index === fullText.length && !skip) {
      onTypingDone?.();
    }
  }, [index, fullText.length, onTypingDone, skip]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setSkip(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isLinkTyped = displayedText.endsWith(linkText);

  const typedIntro = displayedText.slice(0, displayedText.length - (isLinkTyped ? linkText.length : 0));
  const typedLink = isLinkTyped ? linkText : "";

  return (
    <p className="whitespace-pre-wrap font-mono text-sm font-bold text-[#355C7D] items-center text-left leading-loose">
      {typedIntro}
      {typedLink ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline italic text-sm">
          {typedLink}
        </a>
      ) : (
        typedLink 
      )}
      <span className="animate-blink">|</span>
    </p>
    
  );
}

export default TypingText;
