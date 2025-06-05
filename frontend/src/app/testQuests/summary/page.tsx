"use client";
import { useEffect, useState } from "react";
import { preguntas } from "@/utils/preguntas";

const SummaryPage = () => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const collectedAnswers: { [key: string]: string } = {};

    preguntas.forEach((key) => {
      const answer = localStorage.getItem(key);
      collectedAnswers[key] = answer || "(sin respuesta)";
    });

    setAnswers(collectedAnswers);

    // También puedes mandarlo al backend aquí si quieres
    console.log("Respuestas recopiladas:", collectedAnswers);
  }, []);

  return (
    <div>
      <h1>Resumen de tus respuestas</h1>
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