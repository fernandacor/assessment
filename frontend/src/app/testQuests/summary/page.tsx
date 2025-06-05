"use client";
import { useEffect, useState } from "react";

const SummaryPage = () => {
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const collectedAnswers: string[] = [];

    // Suponiendo que tienes 5 preguntas
    for (let i = 1; i <= 11; i++) {
      const answer = localStorage.getItem(`question${i}`);
      if (answer) {
        collectedAnswers.push(answer);
      } else {
        collectedAnswers.push(""); // o null, si prefieres
      }
    }

    setAnswers(collectedAnswers);

    // Opcional: enviar al backend
    console.log("Respuestas recopiladas:", collectedAnswers);
  }, []);

  return (
    <div>
      <h1>Resumen de tus respuestas</h1>
      <ul>
        {answers.map((answer, index) => (
          <li key={index}>Pregunta {index + 1}: {answer}</li>
        ))}
      </ul>
    </div>
  );
};

export default SummaryPage;