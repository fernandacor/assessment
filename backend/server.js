import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import https from "https";
import jwt from "jsonwebtoken";
import { MongoClient, ServerApiVersion } from "mongodb";
import fetch from "node-fetch";

dotenv.config();
let db;

const uri = process.env.MONGO_URI;
const secretKey = process.env.SECRET_KEY;
const localPort = process.env.PORT || 4000;

const dbName = "AssessmentCodeGEN";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function log(sujeto, accion, objeto) {
    let toLog = {};
    toLog["timestamp"] = new Date();
    toLog["sujeto"] = sujeto;
    toLog["accion"] = accion;
    toLog["objeto"] = objeto;
    await db.collection("log").insertOne(toLog);
}

async function connectDB() {
    await client.connect();
    db = client.db(dbName);
    console.log("Conectado a la base de datos");
}

app.post("/api/login", async (request, response) => {
    let user = request.body.username;
    let pass = request.body.password;

    let data = await db.collection("users").findOne({ usuario: user });

    if (data === null) {
        response.sendStatus(401); // Usuario incorrecto
    } else {
        bcrypt.compare(pass, data.contrasena, (error, result) => {
            if (result) {
                let token = jwt.sign({ usuario: data.usuario }, secretKey, {
                    expiresIn: "24hr",
                });
                log(user, "login", "");
                response.json({
                    token: token,
                    id: data.username,
                    nombre: data.name,
                });
            } else {
                response.sendStatus(403); // Contraseña incorrecta
            }
        });
    }
});

app.get("/api/users", async (request, response) => {
    try {
        let token = request.get("Authentication");
        let verifiedToken = await jwt.verify(token, secretKey);
        let data = await db
            .collection("users")
            .find()
            .toArray();
        response.set("Access-Control-Expose-Headers", "X-Total-Count");
        response.set("X-Total-Count", data.length);
        response.json(data);
    } catch {
        response.sendStatus(401);
    }
});

app.post("/api/users", async (req, res) => {
    try {
        const {
            email,
            password,
            confirmPassword,
            name,
            surname,
            address,
            birthdate,
        } = req.body;

        // 1) Validación básica de campos:
        if (
            !email ||
            !password ||
            !confirmPassword ||
            !name ||
            !surname ||
            !address ||
            !birthdate
        ) {
            return res
                .status(400)
                .json({ error: "Faltan campos obligatorios en el body." });
        }
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ error: "La contraseña y su confirmación no coinciden." });
        }

        // 2) Verificar que no exista ya un usuario con ese email
        const existing = await db
            .collection("users")
            .findOne({ usuario: email });
        if (existing) {
            return res.status(409).json({ error: "El usuario ya existe." });
        }

        // 3) Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4) Armar el objeto a insertar en la BD
        const newUser = {
            usuario: email,           // tu campo “usuario” en la colección “users”
            contrasena: hashedPassword,
            nombre: name,
            apellidoPaterno: surname, // si quisieras apellidoMaterno, podrías añadirlo
            // Si quieres separar “surname” en paterno/materno, ajusta aquí:
            address,
            birthdate: new Date(birthdate),
            createdAt: new Date(),
        };

        // 5) Insertar en la colección users
        const result = await db.collection("users").insertOne(newUser);

        // 6) Devolver al front el _id o algún dato mínimo
        return res
            .status(201)
            .json({ insertedId: result.insertedId, message: "Usuario creado." });
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
        const flaskResponse = await fetch("http://inference:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });

        const prediction = await flaskResponse.json();

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
    connectDB();
    console.log(`Servidor HTTP escuchando en http://localhost:${localPort}`);
});