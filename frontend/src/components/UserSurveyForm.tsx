"use client";

import { useState } from "react";

export default function UserSurveyForm() {
  const [formData, setFormData] = useState({
    Age: '19',
    Avg_Daily_Usage_Hours: '7.5',
    Sleep_Hours_Per_Night: '4.8',
    Mental_Health_Score: '5',
    Gender: 'Female',
    Academic_Level: 'Undergraduate',
    Country: 'USA',
    Most_Used_Platform: 'Instagram',
    Affects_Academic_Performance: 'Yes',
    Relationship_Status: 'In Relationship',
    Conflicts_Over_Social_Media: '4',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [prediction, setPrediction] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData)
    try {
      console.log("Aquí entra");
      const response = await fetch("/api/front/eval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
        
      if (response.ok) {
        console.log("Predicción:", result);
        setPrediction(result.prediction); // Mostrar en la interfaz
      } else {
        console.error("Error desde el backend:", result);
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-4">
      {prediction && (
        <p className="mt-4 text-green-600">
          Predicción: <strong>{prediction}</strong>
        </p>
      )}

      <h2 className="text-2xl font-bold mb-4">User Survey</h2>

      <label className="block">
        Age:
        <input
          type="number"
          name="Age"
          value={formData.Age}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block">
        Gender:
        <select name="Gender" value={formData.Gender} onChange={handleChange} className="w-full border p-2 rounded">
          <option>Female</option>
          <option>Male</option>
        </select>
      </label>

      <label className="block">
        Academic Level:
        <select
          name="Academic_Level"
          value={formData.Academic_Level}
          onChange={handleChange}
          className="w-full border p-2 rounded">
          <option>Graduate</option>
          <option>Undergraduate</option>
          <option>High School</option>
        </select>
      </label>

      <label className="block">
        Country:
        <select name="Country" value={formData.Country} onChange={handleChange} className="w-full border p-2 rounded">
          <option>USA</option>
          <option>UK</option>
          <option>Canada</option>
        </select>
      </label>

      <label className="block">
        Avg Daily Usage (hrs):
        <input
          type="number"
          step="0.1"
          name="Avg_Daily_Usage_Hours"
          value={formData.Avg_Daily_Usage_Hours}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block">
        Most Used Platform:
        <select
          name="Most_Used_Platform"
          value={formData.Most_Used_Platform}
          onChange={handleChange}
          className="w-full border p-2 rounded">
          <option>Instagram</option>
          <option>Twitter</option>
          <option>TikTok</option>
          <option>YouTube</option>
          <option>Facebook</option>
        </select>
      </label>

      <label className="block">
        Affects Academic Performance:
        <select
          name="Affects_Academic_Performance"
          value={formData.Affects_Academic_Performance}
          onChange={handleChange}
          className="w-full border p-2 rounded">
          <option>Yes</option>
          <option>No</option>
        </select>
      </label>

      <label className="block">
        Sleep Hours Per Night:
        <input
          type="number"
          step="0.1"
          name="Sleep_Hours_Per_Night"
          value={formData.Sleep_Hours_Per_Night}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block">
        Mental Health Score:
        <input
          type="number"
          name="Mental_Health_Score"
          value={formData.Mental_Health_Score}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block">
        Relationship Status:
        <select
          name="Relationship_Status"
          value={formData.Relationship_Status}
          onChange={handleChange}
          className="w-full border p-2 rounded">
          <option>In Relationship</option>
          <option>Single</option>
          <option>Complicated</option>
        </select>
      </label>

      <label className="block">
        Conflicts Over Social Media:
        <input
          type="number"
          name="Conflicts_Over_Social_Media"
          value={formData.Conflicts_Over_Social_Media}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
        Submit
      </button>
    </form>
  );
}
