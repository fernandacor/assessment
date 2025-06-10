import pandas as pd
import torch
from torch import optim, nn, utils, Tensor
import torch.nn.functional as F
from torchvision import transforms
from torch.utils.data import random_split, DataLoader, Dataset
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import confusion_matrix, classification_report
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import joblib

path = './Students_Social_Media_Addiction.csv'

df = pd.read_csv(path)

print("Cantidad de datos:", len(df))
print("\nInicio del df:\n", df.head())

# Separar características (input_data) target_data etiquetas (target_data)
target_data = df["Addicted_Score"].values
features = df.drop(['Student_ID', 'Addicted_Score'], axis=1)

# 3) One-hot encoding para las columnas categóricas
categorical_cols = [
    'Gender',
    'Academic_Level',
    'Country',
    'Most_Used_Platform',
    'Affects_Academic_Performance',
    'Relationship_Status'
]
df_encoded = pd.get_dummies(features, columns=categorical_cols, drop_first=True)

# 4) Escalar las features resultantes
scaler = StandardScaler()
input_data = scaler.fit_transform(df_encoded)

# 5) Codificar la etiqueta (si quieres tratar Escore como clases)
label_encoder = LabelEncoder()
target_data = label_encoder.fit_transform(target_data)

# 6) Crear el dataset de PyTorch
class TabularDataset(Dataset):
    def __init__(self, X_data, y_data):
        self.X = torch.tensor(X_data, dtype=torch.float32)
        self.y = torch.tensor(y_data, dtype=torch.long)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

total_samples = len(input_data)
train_size = int(0.70 * total_samples)
val_size = int(0.15 * total_samples)
test_size  = total_samples - train_size - val_size

dataset = TabularDataset(input_data, target_data)
train_dataset, val_dataset, test_dataset = random_split(dataset, [train_size, val_size, test_size])

torch.manual_seed(0)

class Classifier(torch.nn.Module):
    def __init__(self, layer_list):
        super().__init__()

        self.encoder = nn.Sequential(*layer_list)

    def forward(self, x):
        x = x.view(x.size(0), -1)
        return self.encoder(x)

n_input = input_data.shape[1]
n_classes = df["Addicted_Score"].nunique()

# Arquitecturas

# SGD
layers1 = [
    nn.Linear(n_input, 16),
    nn.ReLU(),
    nn.Linear(16, n_classes)
]

# Adam
layers2 = [
    nn.Linear(n_input, 32),
    nn.ReLU(),
    nn.Linear(32, n_classes)
]

# Dos hidden layers
layers3 = [
    nn.Linear(n_input, 64),
    nn.ReLU(),
    nn.Linear(64, 64),
    nn.ReLU(),
    nn.Linear(64, 16),
    nn.ReLU(),
    nn.Linear(16, n_classes)
]

models = [Classifier(layers1), Classifier(layers2), Classifier(layers3)]

# Dividir en batches
batches_size = 30
train_loader = DataLoader(train_dataset, batch_size=batches_size)
val_loader = DataLoader(val_dataset, batch_size=batches_size)
test_loader = DataLoader(test_dataset, batch_size=batches_size)

# Entrenamiento
def train_model(model, n_model, optimizer="Adam"):
    print("\n\n\n\n================")
    print(f"Training model {n_model}")
    print("================\n")

    params = model.parameters()
    learning_rate = 1e-3
    if optimizer == "Adam":
        optimizer = torch.optim.Adam(params, lr=learning_rate)
    else:
        optimizer = torch.optim.SGD(params, lr=learning_rate)

    patience = 8
    best_val_loss = float('inf')
    epochs_no_improve = 0
    num_epochs = 1024

    avg_train_losses = []
    avg_val_losses = []

    model.train()
    print("Training on a tensor shaped", len(train_loader), "for", num_epochs ,"epochs")
    for epoch in range (num_epochs):
        print(f"\nEpoch {epoch+1}/{num_epochs}")

        train_losses = []
        for train_batch in train_loader:

            input_data, target_value = train_batch

            if(torch.cuda.is_available()):
                input_data = input_data.cuda(0)

            result_data = model(input_data)

            loss = nn.functional.cross_entropy(result_data, target_value)
            train_losses.append(loss.item())

            loss.backward()
            optimizer.step()
            optimizer.zero_grad()

        avg_train_loss = torch.mean(torch.tensor(train_losses))
        print("Train loss:", avg_train_loss.item())
        avg_train_losses.append(avg_train_loss.item())

        val_losses = []
        all_preds = []
        all_labels = []

        model.eval()
        with torch.no_grad() :
            for val_batch in val_loader:
                input_data, target_value = val_batch
                if(torch.cuda.is_available()):
                    input_data = input_data.cuda(0)
                result_data = model(input_data)
                loss = nn.functional.cross_entropy(result_data, target_value)
                val_losses.append(loss.item())

                all_preds.extend(torch.argmax(result_data, dim=1).cpu().numpy())
                all_labels.extend(target_value.cpu().numpy())

            avg_val_loss = torch.mean(torch.tensor(val_losses))
            print("Val loss:", avg_val_loss.item())
            avg_val_losses.append(avg_val_loss.item())

            if avg_val_loss < best_val_loss:
                best_val_loss = avg_val_loss
                epochs_no_improve = 0
            else:
                print("Validation loss didn't improve for the", epochs_no_improve + 1, "time")
                epochs_no_improve += 1
                if epochs_no_improve >= patience:
                    print("\n--------------")
                    print("Early stopped")
                    print("--------------")
                    break

            model.train()

    return avg_train_losses, avg_val_losses

train_losses = []
val_losses = []

for i in range(3):
    if i == 0:
        train_loss, val_loss = train_model(models[i], i + 1, "SGD")
    else:
        train_loss, val_loss = train_model(models[i], i + 1, "Adam")

    train_losses.append(train_loss)
    val_losses.append(val_loss)

# Hacer gráficas de la evolución de las pérdidas
# plt.figure(figsize=(10, 6))

# for i in range(3):
#     epochs = list(range(1, len(train_losses[i]) + 1))

#     plt.plot(epochs, train_losses[i], label=f'Modelo {i+1} - Train')
#     plt.plot(epochs, val_losses[i], linestyle='--', label=f'Modelo {i+1} - Val')

# plt.xlabel("Época")
# plt.ylabel("Pérdida")
# plt.title("Evolución de la pérdida por modelo")
# plt.legend()
# plt.grid(True)
# plt.tight_layout()
# plt.show()

# # Función para obtener la matriz de confusión

# def evaluate_model(model, test_loader, n_classes):
#     model.eval()
#     confusion = np.zeros((n_classes, n_classes), dtype=int)

#     with torch.no_grad():
#         for input_data, target_data in test_loader:
#             outputs = model(input_data)
#             preds = torch.argmax(F.softmax(outputs, dim=1), dim=1)

#             for true_label, pred_label in zip(target_data, preds):
#                 confusion[true_label.item(), pred_label.item()] += 1

#     return confusion

# # Función para obtener las métricas

# def classification_metrics(conf_mtx):
#     tp = np.diag(conf_mtx)
#     fp = np.sum(conf_mtx, axis=0) - tp
#     fn = np.sum(conf_mtx, axis=1) - tp
#     precision = np.divide(tp, tp + fp, out=np.zeros_like(tp, dtype=float), where=(tp + fp) != 0)
#     recall = np.divide(tp, tp + fn, out=np.zeros_like(tp, dtype=float), where=(tp + fn) != 0)
#     f1 = np.divide(2 * precision * recall, precision + recall, out=np.zeros_like(tp, dtype=float), where=(precision + recall) != 0)
#     accuracy = np.sum(tp) / np.sum(conf_mtx)

#     print("\n\n=== MÉTRICAS POR CLASE ===")
#     for i in range(len(tp)):
#         print(f"Clase {i + 1}: Precision={precision[i]:.4f}, Recall={recall[i]:.4f}, F1-Score={f1[i]:.4f}")

#     print("\n=== MÉTRICAS GLOBALES ===")
#     print(f"Accuracy: {accuracy}")

#     macro_precision = np.mean(precision)
#     macro_recall = np.mean(recall)
#     macro_f1 = np.mean(f1)

#     print(f"Macro Precision: {macro_precision}")
#     print(f"Macro Recall: {macro_recall}")
#     print(f"Macro F1: {macro_f1}")

#     return accuracy, macro_precision, macro_recall, macro_f1

# conf_matrices = []

# accuracies = []
# macro_precisions = []
# macro_recalls = []
# macro_f1s = []

# for i in range(3):
#     conf_matrix = evaluate_model(models[i], test_loader, n_classes)
#     conf_matrices.append(conf_matrix)

#     accuracy, macro_precision, macro_recall, macro_f1 = classification_metrics(conf_matrix)
#     accuracies.append(accuracy)
#     macro_precisions.append(macro_precision)
#     macro_recalls.append(macro_recall)
#     macro_f1s.append(macro_f1)

#     model_labels = [f"Modelo {i+1}" for i in range(len(accuracies))]

# # Gráfica de las métricas
# print()

# metric_names = ["Accuracy", "Precision", "Recall", "F1-Score"]
# metric_values = [accuracies, macro_precisions, macro_recalls, macro_f1s]

# x = np.arange(len(metric_names))
# width = 0.2

# plt.figure(figsize=(10, 6))

# for i in range(len(model_labels)):
#     plt.bar(x + i * width, [metric_values[j][i] for j in range(len(metric_names))],
#             width=width, label=model_labels[i])

# plt.xticks(x + width, metric_names)
# plt.ylabel("Valor")
# plt.ylim(0, 1)
# plt.title("Comparación de métricas por modelo", pad=20)
# plt.legend()
# plt.grid(axis='y')

# for i in range(len(model_labels)):
#     for j in range(len(metric_names)):
#         valor = metric_values[j][i]
#         x_pos = x[j] + i * width
#         plt.text(x_pos, valor + 0.01, f"{valor:.5f}", ha='center', va='bottom', fontsize=8)

# plt.tight_layout()
# plt.show()

# # Gráfica de la confussion matrix

# for i, matrix in enumerate(conf_matrices):
#     print()
#     plt.figure(figsize=(6, 6))
#     sns.heatmap(matrix, annot=True, fmt="d", cmap="Blues", cbar=False)
#     plt.title(f"Matriz de Confusión - Modelo {i+1}")
#     plt.xlabel("Predicción")
#     plt.ylabel("Valor real")
#     plt.tight_layout()
#     plt.show()

# def evaluate_model(model, test_loader):
#     model.eval()
#     all_labels = []
#     all_preds = []

#     with torch.no_grad():
#         for input_data, target_data in test_loader:
#             outputs = model(input_data)
#             preds = torch.argmax(F.softmax(outputs, dim=1), dim=1)

#             all_labels.extend(target_data.tolist())
#             all_preds.extend(preds.tolist())

#     print("\nClassification Report:")
#     print(classification_report(all_labels, all_preds, digits=4))

#     print("Confusion Matrix:")
#     matrix = confusion_matrix(all_labels, all_preds)
#     print(matrix)

#     return matrix


# for i in range(3):
#     evaluate_model(models[i], test_loader)

# 1) Tomar el diccionario con valores sin procesar
row = {
  "Age": 19,
  "Avg_Daily_Usage_Hours": 7.5,
  "Sleep_Hours_Per_Night": 6.2,
  "Mental_Health_Score": 3.0,  # si existiera esa columna, por ejemplo
  "Gender": "Female",
  "Academic_Level": "Undergraduate",
  "Country": "USA",
  "Most_Used_Platform": "Instagram",
  "Affects_Academic_Performance": "Yes",
  "Relationship_Status": "In Relationship",
  "Conflicts_Over_Social_Media": 4,
}

# 2) Lo convertimos a DataFrame de una sola fila
df_row = pd.DataFrame([row])

# 3) Aplicar get_dummies usando exactamente las mismas columnas que en entrenamiento:
categorical_cols = [
    'Gender',
    'Academic_Level',
    'Country',
    'Most_Used_Platform',
    'Affects_Academic_Performance',
    'Relationship_Status'
]

# A) Hacemos get_dummies sobre esa fila:
df_row_encoded = pd.get_dummies(df_row, columns=categorical_cols, drop_first=True)

# B) Para asegurarnos de que tenga todas las columnas que tuvo df_encoded en entrenamiento,
#    hacemos reindex con relleno de 0 en las que falten:
all_columns = df_encoded.columns.tolist()  # lista que obtuviste en tu script de entrenamiento
df_row_aligned = df_row_encoded.reindex(columns=all_columns, fill_value=0)

# 4) Finalmente sacamos un vector numpy de longitud n_input:
input_vector = df_row_aligned.values.flatten().tolist()  # lista de tamaño n_input

def infer_crop(input_vector, model, scaler, label_encoder):
    """
    input_vector: lista o numpy array de longitud EXACTA n_input (columnas post get_dummies).
    model:         instancia de tu Classifier(layers3) con pesos cargados.
    scaler:        StandardScaler ya entrenado, tal que scaler.scale_ existe.
    label_encoder: LabelEncoder ya entrenado para Addicted_Score.
    """
    model.eval()

    # 4.1) Convertir a numpy array con shape (1, n_input)
    arr = np.array(input_vector, dtype=float).reshape(1, -1)  # p.ej. (1, 50)

    # 4.2) Escalar con el mismo scaler de entrenamiento
    arr_scaled = scaler.transform(arr)  # shape (1, n_input)

    # 4.3) Pasar a tensor de PyTorch
    input_tensor = torch.tensor(arr_scaled, dtype=torch.float32)  # shape (1, n_input)

    # 4.4) Inferencia
    with torch.no_grad():
        logits = model(input_tensor)                 # shape (1, n_classes)
        pred_idx = torch.argmax(logits, dim=1).item()  # índice de la clase (int)

    # 4.5) Convertir índice a etiqueta real (Addicted_Score) con el label_encoder
    pred_label = label_encoder.inverse_transform([pred_idx])[0]
    return pred_label

# 5) Llamar a infer_crop con ese input_vector
pred = infer_crop(input_vector, models[2], scaler, label_encoder)
print("Predicción para esa fila:", pred)



torch.save(models[2].state_dict(), "../inference/app/model.pt")
joblib.dump(scaler, "../inference/app/scaler.pkl")
joblib.dump(label_encoder, "../inference/app/label_encoder.pkl")
all_columns = df_encoded.columns.tolist()
joblib.dump(all_columns, "../inference/app/all_columns.pkl")