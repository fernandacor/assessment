import bcrypt from "bcrypt";
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

app.post("/users", async (request, response) => {
  try {
    let addValue = request.body;

    let data = await db.collection("users").find({}).toArray();
    let id = data.length + 1;
    addValue.id = id;

    let existing = await db
      .collection("users")
      .findOne({ usuario: addValue.usuario });

    if (existing) {
      return response.status(409).json({ error: "El usuario ya existe." });
    }

    const pass = addValue.contrasena;
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) {
        console.error("Error al generar salt:", saltErr);
        return response.sendStatus(500);
      }

      bcrypt.hash(pass, salt, async (hashErr, hash) => {
        if (hashErr) {
          console.error("Error al hashear contraseña:", hashErr);
          return response.sendStatus(500);
        }

        addValue.contrasena = hash;

        try {
          const result = await db.collection("users").insertOne(addValue);
          // Devolver el documento insertado (puedes ajustarlo a tu conveniencia)
          return response.status(201).json({ insertedId: result.insertedId });
        } catch (dbErr) {
          console.error("Error al insertar usuario en BD:", dbErr);
          return response.sendStatus(500);
        }
      });
    });
  } catch (err) {
    console.error("Error en POST /users:", err);
    return response.sendStatus(500);
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

const localPort = 3000;
app.listen(localPort, () => {
    connectDB();
    console.log(`Servidor HTTP escuchando en http://localhost:${localPort}`);
});