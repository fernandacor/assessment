"use client";

import { useState } from "react";

export default function UserSurveyForm() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "Female",
    academicLevel: "Graduate",
    country: "USA",
    avgDailyUsageHours: "",
    mostUsedPlatform: "Instagram",
    affectsAcademicPerformance: "Yes",
    sleepHoursPerNight: "",
    mentalHealthScore: "",
    relationshipStatus: "In Relationship",
    conflictsOverSocialMedia: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [prediction, setPrediction] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Aquí entra");
      const response = await fetch("/api/evaluate", {
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
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block">
        Gender:
        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded">
          <option>Female</option>
          <option>Male</option>
        </select>
      </label>

      <label className="block">
        Academic Level:
        <select
          name="academicLevel"
          value={formData.academicLevel}
          onChange={handleChange}
          className="w-full border p-2 rounded">
          <option>Graduate</option>
          <option>Undergraduate</option>
          <option>High School</option>
        </select>
      </label>

      <label className="block">
        Country:
        <select name="country" value={formData.country} onChange={handleChange} className="w-full border p-2 rounded">
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
          name="avgDailyUsageHours"
          value={formData.avgDailyUsageHours}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block">
        Most Used Platform:
        <select
          name="mostUsedPlatform"
          value={formData.mostUsedPlatform}
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
          name="affectsAcademicPerformance"
          value={formData.affectsAcademicPerformance}
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
          name="sleepHoursPerNight"
          value={formData.sleepHoursPerNight}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block">
        Mental Health Score:
        <input
          type="number"
          name="mentalHealthScore"
          value={formData.mentalHealthScore}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block">
        Relationship Status:
        <select
          name="relationshipStatus"
          value={formData.relationshipStatus}
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
          name="conflictsOverSocialMedia"
          value={formData.conflictsOverSocialMedia}
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
