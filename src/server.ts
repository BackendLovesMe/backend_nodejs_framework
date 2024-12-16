import "reflect-metadata";
import {
  interfaces,
  InversifyExpressServer,
  TYPE,
} from "inversify-express-utils";
import { Container } from "inversify";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import * as useragent from "express-useragent";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
const multer = require("multer");
const path = require("path");
import { AppDataSource } from "./config/data-source";

import TYPES from "./constant/Types";

import "./controller/controller";
import { Service } from "./service/service";
import { repository } from "./repository/Repository";
import { globalException } from "./exception/global_Exception";

//create container instance
let container = new Container();

container.bind<Service>(TYPES.Service).to(Service);
container.bind<repository>(TYPES.repository).to(repository);
// Initialize the server
let server = new InversifyExpressServer(container);

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".xlsx" || ext === ".pdf" || ext === ".mp4") {
    cb(null, true);
  } else {
    cb(new Error("File format not supported"), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 25,
  },
});
//Initialize the database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => console.error("Database connection error:", err));
//set middleware in server configuration
server.setConfig((app) => {
  app.use(compression());
  app.use(helmet());
  app.use(bodyParser.json({ limit: "25mb" }));
  app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
  app.use(useragent.express());
  app.use(cookieParser());
  app.use(upload.fields([{ name: "file", maxCount: 1 }])); //multer middleware for asset upload api
  //handle cors for request
  app.use(cors());
  app.use(cookieParser());
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    next();
  });
});

//Centralized Exception Handling
server.setErrorConfig((app) => {
  app.use((err, req, res, next) => {
    console.log("server.ts", err);
    res.status(500).send(globalException.handleError(err, req.originalUrl));
  });
});

process.on("uncaughtException", (err) => {
  // console.log('uncaughtException',err);
  globalException.handleError(err, "/api/v1.0/uncaughtException");
});

process.on("unhandledRejection", (err) => {
  // console.log('unhandledRejection',err);
  globalException.handleError(err, "/api/v1.0/unhandledRejection");
});

process.on("rejectionHandled", (err) => {
  // console.log('rejectionHandled',err);
  globalException.handleError(err, "/api/v1.0/rejectionHandled");
});

// salesforceClientInstance.oauthLogin();

let app = server.build();
app.listen(process.env.VCAP_APP_PORT || 8080); //port allocation and server is listenning on this port
console.log(
  "Server Starting on : http://localhost:" + (process.env.VCAP_APP_PORT || 8080)
);
exports = module.exports = app;
