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
    <div>
      <h1>Resumen de tus respuestas</h1>

      <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        <motion.span>{displayText}</motion.span>
        <CursorBlinker />
      </div>

      
      <ul>
        {preguntas.map((key) => (
          <li key={key}>
            <strong>{key}:</strong> {answers[key]}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default SummaryPage;