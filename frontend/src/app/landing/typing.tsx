"use client";
import React, { useEffect, useState } from 'react';

interface TypingTextProps {
  onTypingDone?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({ onTypingDone }) => {
  const introText = `Social networks are a set of websites and applications that enable individuals and communities to connect, discuss and exchange information, and/or produce and share contents. Today, due to the rapid advancement of technology and the typical effortless access to smartphones, the use of social networks has been growing expeditiously.
A big proportion of social network users are university students. The use of these networks can have both positive and negative effects on students' academic performance. However, based on a study by Woods et al. that the adverse effects of these networks outweigh the positive effects \n`;

  const linkText =
    "\n- The impact of social networking addiction on the academic achievement of university students globally: A meta-analysis. (2025)";
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
    <p className="whitespace-pre-wrap font-mono text-sm font-bold text-white items-center text-center">
      {typedIntro}
      {typedLink ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline italic text-xs">
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
