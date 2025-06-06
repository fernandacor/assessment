import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import https from "https";
import jwt from "jsonwebtoken";
import { MongoClient, ServerApiVersion } from "mongodb";

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

app.get("/analysis", async (request, response) => {
  try{
    let token = request.get("Authentication");
    let verifiedToken = await jwt.verify(token, secretKey);
    let data = await db
      .collection("analysis")
      .find()
      .toArray();
    response.set("Access-Control-Expose-Headers", "X-Total-Count");
    response.set("X-Total-Count", data.length);
    response.json(data);
  }catch{
    response.sendStatus(401);
  }
});

app.post("/analysis", async (req, res) => {
  try {
    // 1) Verificar que llegue el JWT en el header "Authentication"
    const token = req.get("Authentication");
    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    // 2) Decodificar y verificar el token
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    // 3) Extraer el correo (usuario) del payload del JWT
    //    Aquí asumo que al firmar el token guardaste { usuario: email, ... }
    const userEmail = decoded.usuario;
    if (!userEmail) {
      return res.status(401).json({ error: "Token no contiene usuario" });
    }

    // 4) Extraer los campos esperados del body
    const {
      age,
      gender,
      academicLevel,
      country,
      dailyUsage,
      favPlatform,
      academicPerformance,
      sleepHours,
      mentalHealth,
      relationship,
      conflicts,
    } = req.body;

    // 5) Validación “manual” de que todos existan (no sean undefined)
    if (
      age === undefined ||
      gender === undefined ||
      academicLevel === undefined ||
      country === undefined ||
      dailyUsage === undefined ||
      favPlatform === undefined ||
      academicPerformance === undefined ||
      sleepHours === undefined ||
      mentalHealth === undefined ||
      relationship === undefined ||
      conflicts === undefined
    ) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios en el body." });
    }

    // 6) Armar el documento final (sólo con los campos válidos)
    const newAnalysisDoc = {
      usuario: userEmail,
      age,
      gender,
      academicLevel,
      country,
      dailyUsage,
      favPlatform,
      academicPerformance,
      sleepHours,
      mentalHealth,
      relationship,
      conflicts,
      createdAt: new Date(),
    };

    // 7) Insertar en la colección "analysis"
    const result = await db.collection("analysis").insertOne(newAnalysisDoc);

    // 8) Devolver el documento creado (y opcionalmente un header con el ID)
    return res
      .set("Access-Control-Expose-Headers", "X-Inserted-Id")
      .set("X-Inserted-Id", result.insertedId.toString())
      .status(201)
      .json(newAnalysisDoc);
  } catch (err) {
    console.error("Error en POST /analysis:", err);
    return res.status(500).json({ error: "Error interno en el servidor" });
  }
});


app.post("/api/users", async (req, res) => {
  try {
    const {
      email,
      password,
      username,
    } = req.body;

    // 1) Validación básica de campos:
    if (
      !email ||
      !password ||
      !username
    ) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios en el body." });
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
      username: username,
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

app.get('/api/hello', (req, res) => {
    res.send(`Hola desde ${process.env.INSTANCE_NAME || 'backend genérico'}\n`);
});

app.listen(localPort, '0.0.0.0', () => {
    connectDB();
    console.log(`Servidor HTTP escuchando en http://localhost:${localPort}`);
});