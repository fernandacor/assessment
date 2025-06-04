import bcryptjs from "bcryptjs";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import https from "https";
import jwt from "jsonwebtoken";
import { MongoClient, ServerApiVersion } from "mongodb";

const dbUser = "userTEC";
const dbPassword = "jk3mi94r23wooQ2t";
const dbName = "AssessmentCodeGEN";
const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.vdbez5z.mongodb.net`;
// const port = 443;
let db;
const localPort = 4000;

const secretKey = "FCO7403AR0704SM2103SA0703";

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

app.post("/login", async (request, response) => {
  let user = request.body.username;
  let pass = request.body.password;

  let data = await db.collection("users").findOne({ usuario: user });

  if (data === null) {
    response.sendStatus(401); // Usuario incorrecto
  } else {
    bcryptjs.compare(pass, data.contrasena, (error, result) => {
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

app.get("/users", async (request, response) => {
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

app.post("/users", async (req, res) => {
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
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

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

app.get("/users/:id", async (request, response) => {
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
  
app.put("/users/:id", async (request, response) => {
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
  
app.delete("/users/:id", async (request, response) => {
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

app.listen(localPort, () => {
    connectDB();
    console.log(`Servidor HTTP escuchando en http://localhost:${localPort}`);
});