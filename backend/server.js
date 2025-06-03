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

app.get("/users", async (request, response) => {
    try {
      let token = request.get("Authentication");
      let verifiedToken = await jwt.verify(token, secretKey);
      let data = await db
        .collection("users")
        .find()
        //.project({ _id: 0, id: 1, nombre: 1, apellidoMaterno: 1 })
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
      let token = request.get("Authentication");
      let verifiedToken = await jwt.verify(token, secretKey);
      let addValue = request.body;
      let data = await db.collection("users").find({}).toArray();
      let id = data.length + 1;
      let avatar = addValue["avatar"];
      if (request.body.permissions == "Ejecutivo") {
        addValue["avatar"] = "../../images/avatarEjec.PNG";
      } else if (request.body.permissions == "Coordinador") {
        addValue["avatar"] = "../../images/avatarCoordAula.PNG";
      } else if (request.body.permissions == "Nacional") {
        addValue["avatar"] = "../../images/avatarCoordNac.PNG";
      }
      addValue["id"] = id;
      let pass = addValue["contrasena"];
      console.log(request.body);
      data = await db
        .collection("users")
        .findOne({ usuario: addValue["usuario"] });
      if (data == null) {
        try {
          bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(pass, salt, async (error, hash) => {
              let data = await db.collection("users").find({}).toArray();
              addValue["contrasena"] = hash;
              console.log(addValue);
              //let usuarioAgregar={"id": id, "usuario": user, "contrasena": hash, "nombre": name, "apellidoPaterno":flastname, "apellidoMaterno":slastname};
              data = await db.collection("users").insertOne(addValue);
              response.json(data);
            });
          });
        } catch {
          response.sendStatus(401);
        }
      } else {
        response.sendStatus(401);
      }
    } catch {
      response.sendStatus(401);
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