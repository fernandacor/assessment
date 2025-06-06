from flask import Flask, request, jsonify
import torch
import torch.nn as nn
import pandas as pd
import joblib

# Cargar modelo y herramientas
scaler = joblib.load("app/scaler.pkl")
label_encoder = joblib.load("app/label_encoder.pkl")

# Modelo igual al entrenado
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

# Inicializar modelo
input_size = scaler.mean_.shape[0]
n_classes = len(label_encoder.classes_)
model = Classifier(input_size, n_classes)
model.load_state_dict(torch.load("app/model.pt", map_location=torch.device("cpu")))
model.eval()

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    try:
        df = pd.DataFrame([data])
        df_encoded = pd.get_dummies(df)

        for col in scaler.feature_names_in_:
            if col not in df_encoded:
                df_encoded[col] = 0
        df_encoded = df_encoded[scaler.feature_names_in_]

        X = scaler.transform(df_encoded)
        X_tensor = torch.tensor(X, dtype=torch.float32)

        with torch.no_grad():
            output = model(X_tensor)
            pred_idx = torch.argmax(output, dim=1).item()
            label = label_encoder.inverse_transform([pred_idx])[0]

        return jsonify({"prediction": label.item() if hasattr(label, 'item') else str(label)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
