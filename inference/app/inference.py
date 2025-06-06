from flask import Flask, request, jsonify
import torch
import torch.nn as nn
import pandas as pd
import joblib
import numpy as np

# 1) Definir la arquitectura EXACTA usada en entrenamiento
class Classifier(nn.Module):
    def __init__(self, input_size, n_classes):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_size, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU(),
            nn.Linear(64, 16),
            nn.ReLU(),
            nn.Linear(16, n_classes)
        )

    def forward(self, x):
        x = x.view(x.size(0), -1)
        return self.encoder(x)

# 2) Cargar scaler, label_encoder y all_columns desde disco
scaler = joblib.load("app/scaler.pkl")
label_encoder = joblib.load("app/label_encoder.pkl")
all_columns = joblib.load("app/all_columns.pkl")

input_size = int(scaler.mean_.shape[0])
n_classes  = int(len(label_encoder.classes_))

# 3) Reconstruir el modelo, cargar pesos, poner en modo eval
model = Classifier(input_size, n_classes)
model.load_state_dict(torch.load("app/model.pt", map_location=torch.device("cpu")))
model.eval()

app = Flask(__name__)

@app.route("/")
def home():
    return "Hola mundo"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    try:
        # ── 1) Convertir los campos numéricos de string a número ───────────────
        data["Age"]                    = int(data["Age"])
        data["Avg_Daily_Usage_Hours"]  = float(data["Avg_Daily_Usage_Hours"])
        data["Sleep_Hours_Per_Night"]  = float(data["Sleep_Hours_Per_Night"])
        data["Mental_Health_Score"]    = float(data["Mental_Health_Score"])
        data["Conflicts_Over_Social_Media"] = int(data["Conflicts_Over_Social_Media"])

        
        df = pd.DataFrame([data])

        # ── 3) One-hot encoding + reindex (llenar con 0 si faltan columnas) ─────
        categorical_cols = [
            'Gender',
            'Academic_Level',
            'Country',
            'Most_Used_Platform',
            'Affects_Academic_Performance',
            'Relationship_Status'
        ]
        df_row_encoded = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

        df_row_aligned = df_row_encoded.reindex(columns=all_columns, fill_value=0)

        # ── 4) Escalar con el StandardScaler entrenado ─────────────────────────────
        X = scaler.transform(df_row_aligned)
        print(">>> X tras scaler (shape):", X.shape, X)

        X_tensor = torch.tensor(X, dtype=torch.float32)

        # ── 5) Inferencia con PyTorch ────────────────────────────────────────────
        print(">>> Paso 5: Inferencia")
        with torch.no_grad():
            out = model(X_tensor)
            pred_idx = torch.argmax(out, dim=1).item()
            label_np = label_encoder.inverse_transform([pred_idx])[0]
            # label_np es ahora np.int64 o np.str_ si tu LabelEncoder contenía strings.

        # ── 6) Asegurar que sea tipo nativo de Python (int o str) ────────────────
        if isinstance(label_np, np.generic):
            label_py = label_np.item()   # np.int64 → int nativo, np.str_ → str nativo
        else:
            label_py = label_np          # si ya era str de Python

        # ── 7) Devolver JSON con valor puro de Python ────────────────────────────
        return jsonify({"prediction": label_py.item() if hasattr(label_py, 'item') else str(label_py)})

    except Exception as e:
        print(">>> ERROR en predict():", str(e), type(e))
        return jsonify({"error": str(e)}), 400
