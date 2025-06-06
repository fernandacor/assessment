import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import https from "https";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { MongoClient, ServerApiVersion } from "mongodb";
import fetch from "node-fetch";

dotenv.config();
let db;

const uri = process.env.MONGO_URI;
const secretKey = process.env.SECRET_KEY;
const localPort = process.env.PORT || 4000;

// const dbName = "AssessmentCodeGEN";

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// 2) Definir un esquema y modelo para “users”
const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Nombre de la colección será “users” (mongoose automáticamente lo pluraliza)
const User = mongoose.model("User", userSchema);

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  sujeto: { type: String, required: true },
  accion: { type: String, required: true },
  objeto: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const Log = mongoose.model("Log", logSchema);
//   ---------------

// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
// });

// async function connectDB() {
//     await client.connect();
//     db = client.db(dbName);
//     console.log("Conectado a la base de datos");
// }

async function log(sujeto, accion, objeto) {
  try {
    await Log.create({ sujeto, accion, objeto });
  } catch (err) {
    console.error("Error al guardar log:", err);
  }
}

app.post("/api/login", async (req, res) => {
  try {
    let user = req.body.username;
    let pass = req.body.password;

    // 1) Buscar el usuario por su “usuario” (email)
    const data = await User.findOne({ usuario: user }).lean();
    if (!data) {
      // Si no existe usuario con ese mail
      return res.sendStatus(401); // Usuario incorrecto
    }

    // 2) Comparar contraseña
    const match = await bcrypt.compare(pass, data.contrasena);
    if (!match) {
      return res.sendStatus(403); // Contraseña incorrecta
    }

    // 3) Firmar un JWT con payload { usuario }
    const token = jwt.sign({ usuario: data.usuario, id: data._id }, secretKey, {
      expiresIn: "24h",
    });

    // 4) Guardar en log (sujeto = usuarioBuscado, acción = "login", objeto = "")
    await log(user, "login", {});

    // 5) Devolver token e información mínima
    return res.json({
      token,
      id: data._id,
      nombre: data.username,
    });
  } catch (err) {
    console.error("Error en POST /api/login:", err);
    return res.status(500).json({ error: "Error interno en login." });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().lean();
    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", users.length);
    return res.json(users);
  } catch (err) {
    console.error("Error en GET /users:", err);
    return res.status(500).json({ error: "Error interno." });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios en el body." });
    }

    // 2) Verificar si ya existe el email
    const existing = await User.findOne({ usuario: email });
    if (existing) {
      return res
        .status(409)
        .json({ error: "El usuario ya existe." });
    }

    // 3) Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4) Crear el documento
    const newUser = new User({
      usuario: email,
      contrasena: hashedPassword,
      username: username,
      // createdAt se llena solo si no se proporciona
    });

    // 5) Guardar en BD
    const saved = await newUser.save();

    // 6) Responder
    return res
      .status(201)
      .json({ insertedId: saved._id, message: "Usuario creado." });
  } catch (err) {
    console.error("Error en POST /users:", err);
    return res
      .status(500)
      .json({ error: "Error interno al crear el usuario." });
  }
});

app.get("/api/users/:id", async (request, response) => {
    try {
        let token = request.get("Authentication");
        let verifiedToken = await jwt.verify(token, secretKey);
        let data = await db
            .collection("users")
            .find({ id: Number(request.params.id) })
            .project({ _id: 0 })
            .toArray();
        response.json(data[0]);
    } catch {
        response.sendStatus(401);
    }
});

app.put("/api/users/:id", async (request, response) => {
    try {
        let token = request.get("Authentication");
        let verifiedToken = await jwt.verify(token, secretKey);
        let addValue = request.body;
        addValue["id"] = Number(request.params.id);
        let data = await db
            .collection("users")
            .updateOne({ id: addValue["id"] }, { $set: addValue });
        data = await db
            .collection("users")
            .find({ id: Number(request.params.id) })
            .project({ _id: 0 })
            .toArray();
        response.json(data[0]);
    } catch {
        response.sendStatus(401);
    }
});

app.delete("/api/users/:id", async (request, response) => {
    try {
        let token = request.get("Authentication");
        let verifiedToken = await jwt.verify(token, secretKey);
        let data = await db
            .collection("users")
            .deleteOne({ id: Number(request.params.id) });
        response.json(data);
    } catch {
        response.sendStatus(401);
    }
});

app.post("/api/eval", async (req, res) => {
    try {
        console.log(req.body);
        console.log(JSON.stringify(req.body))
        const flaskResponse = await fetch(`${process.env.INFERENCE_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });

        const prediction = await flaskResponse.json();

        console.log(prediction);

        res.json(prediction);
    } catch (err) {
        console.error("Error al comunicar con el modelo:", err);
        res.status(500).json({ error: "Error interno al evaluar el modelo." });
    }
});


app.get('/api/hello', (req, res) => {
    res.send(`Hola desde ${process.env.INSTANCE_NAME || 'backend genérico'}\n`);
});

app.listen(localPort, '0.0.0.0', () => {
    console.log(`Servidor HTTP escuchando en http://localhost:${localPort}`);
});