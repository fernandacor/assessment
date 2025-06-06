"use client";

import { useEffect, useState } from "react";
import { preguntas } from "@/utils/preguntas";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import CursorBlinker from "./CursorBlinker";
import { useRouter } from "next/navigation";

const SummaryPage = () => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const router = useRouter();

  const baseText = "Your score is: ";
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    baseText.slice(0, latest)
  );

  useEffect(() => {
    const collectedAnswers: { [key: string]: string } = {};
    preguntas.forEach((key) => {
      const answer = localStorage.getItem(key);
      collectedAnswers[key] = answer || "(no answer)";
    });
    setAnswers(collectedAnswers);

    const controls = animate(count, baseText.length, {
      type: "tween",
      duration: 1,
      ease: "easeInOut",
    });

    return controls.stop;
  }, []);

  const handleRetakeQuiz = () => {
    preguntas.forEach((key) => localStorage.removeItem(key));
    router.push("/"); // replace with your quiz start route
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#333333] text-[#C5CAE9] p-8 relative">

      {/* Score Box */}
      <div className="relative bg-[#355C7D] shadow-[0_0_30px_5px_#A8E6CF] border-4 border-[#A8E6CF]/50 rounded-3xl px-12 py-10 text-4xl font-extrabold text-center max-w-3xl w-full mb-8">
        <motion.span className="drop-shadow-lg">{displayText}</motion.span>
        <CursorBlinker />
      </div>

      {/* Buttons Row */}
      <div className="flex gap-4 mb-6 mt-10">
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="px-6 py-2 bg-[#355C7D] text-[#FAFAFA] font-semibold rounded-xl hover:bg-[#97b7d3] transition duration-200 hover:text-[#333]"
        >
          {showAnswers ? "Hide Details" : "Show Answers"}
        </button>
        <button
          onClick={handleRetakeQuiz}
          className="px-6 py-2 bg-[#C5CAE9] text-[#333] font-semibold rounded-xl hover:bg-[#8891b4] hover:text-[#FAFAFA] transition duration-200"
        >
          Retake Quiz
        </button>
      </div>

      {/* Answers Box */}
      {showAnswers && (
  <div className="w-full max-w-2xl bg-[#444]/30 p-6 rounded-2xl shadow-inner border border-[#C5CAE9]/20 text-sm overflow-auto max-h-[40vh]">
    <table className="w-full table-auto border-collapse text-left text-[#C5CAE9]/90">
      <tbody>
        {preguntas.map((key) => (
          <tr key={key} className="hover:bg-[#355C7D]/20 transition">
             <td className="px-3 py-1 leading-tight font-medium">{key}</td>
             <td className="px-3 py-1 leading-tight">{answers[key]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
      )}
    </div>
  );
};

export default SummaryPage;
