"use client";
import { useEffect, useState } from "react";
import { preguntas } from "@/utils/preguntas";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import CursorBlinker from "./CursorBlinker";

const SummaryPage = () => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

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
      collectedAnswers[key] = answer || "(sin respuesta)";
    });

    setAnswers(collectedAnswers);

    // También puedes mandarlo al backend aquí si quieres
    console.log("Respuestas recopiladas:", collectedAnswers);

    // Iniciar animación
    const controls = animate(count, baseText.length, {
      type: "tween",
      duration: 1,
      ease: "easeInOut",
    });

    return controls.stop;
    
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#333333] text-[#C5CAE9] p-8">

      <div className="shadow-lg shadow-[#A8E6CF]/50 bg-[#444] rounded-2xl p-6 mb-8 flex items-center justify-center font-bold text-2xl">
        <motion.span>{displayText}</motion.span>
        <CursorBlinker />
      </div>

      
      {/* Subtle Answers List */}
      <div className="w-full max-w-xl bg-[#444]/30 p-6 rounded-2xl shadow-inner border border-[#C5CAE9]/20 text-sm overflow-hidden max-h-[40vh] mt-10">
        <ul className="space-y-1 text-[#C5CAE9]/80">
          {preguntas.map((key) => (
            <li key={key}>
              <span className="font-medium text-[#C5CAE9]">{key}</span>: {answers[key]}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default SummaryPage;