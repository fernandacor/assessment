from fastapi import FastAPI, Request
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# Cargar modelo una vez
model = joblib.load("model.pkl")

class InputData(BaseModel):
    age: int
    gender: str
    academicLevel: str
    country: str
    avgDailyUsageHours: float
    mostUsedPlatform: str
    affectsAcademicPerformance: str
    sleepHoursPerNight: float
    mentalHealthScore: int
    relationshipStatus: str
    conflictsOverSocialMedia: int

@app.post("/predict")
def predict(data: InputData):
    # Preprocesamiento simple — deberías replicar el mismo del entrenamiento
    input_vector = [
        data.age,
        0 if data.gender == 'Female' else 1,
        ['Graduate', 'Undergraduate', 'High School'].index(data.academicLevel),
        ['USA', 'UK', 'Canada'].index(data.country),
        data.avgDailyUsageHours,
        ['Instagram', 'Twitter', 'TikTok', 'YouTube', 'Facebook'].index(data.mostUsedPlatform),
        1 if data.affectsAcademicPerformance == 'Yes' else 0,
        data.sleepHoursPerNight,
        data.mentalHealthScore,
        ['In Relationship', 'Single', 'Complicated'].index(data.relationshipStatus),
        data.conflictsOverSocialMedia
    ]
    
    prediction = model.predict([input_vector])[0]
    return {"prediction": prediction}
