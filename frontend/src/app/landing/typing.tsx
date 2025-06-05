"use client";
import React, { useEffect, useState } from 'react';

interface TypingTextProps {
  onTypingDone?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({ onTypingDone }) => {
  const introText = `Social networks are a set of websites and applications that enable individuals and communities to connect, discuss and exchange information, and/or produce and share contents. Today, due to the rapid advancement of technology and the typical effortless access to smartphones, the use of social networks has been growing expeditiously.
 A big proportion of social network users are university students. The use of these networks can have both positive and negative effects on students' academic performance. However, based on a study by H.C. Woods, declares that the adverse effects of these networks outweigh the positive effects \n`;

  const linkText =
    "\n- The impact of social networking addiction on the academic achievement of university students globally: A meta-analysis. (2025)";
  const linkUrl = "https://doi.org/10.1016/j.puhip.2025.100584";
  
  const questionText = `\n\nDo you have an addiction to social media?`;

  const fullText = introText + " " + linkText + " " + questionText;

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

  const linkStartIndex = introText.length + 1; // \n
  const questionStartIndex = linkStartIndex + linkText.length + 2; // \n\n

  const typedIntro = displayedText.slice(0, Math.min(displayedText.length, linkStartIndex));
  const typedLink = displayedText.slice(linkStartIndex, Math.min(displayedText.length, questionStartIndex));
  const typedQuestion = displayedText.slice(questionStartIndex);

  return (
    <div className="whitespace-pre-wrap font-mono text-sm font-bold text-white text-center">
      {typedIntro}
      {typedLink && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline italic text-xs"
        >
          {typedLink}
        </a>
      )}
      {typedQuestion && (
        <p className="mt-4 text-xl text-white font-semibold">
          {typedQuestion}
        </p>
      )}
      <span className="animate-blink">|</span>
    </div>
  );
}

export default TypingText;
