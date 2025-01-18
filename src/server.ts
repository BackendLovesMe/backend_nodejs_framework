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

const path = require("path");
import { AppDataSource } from "./config/data-source";

import TYPES from "./constant/Types";
import "./controller/bookingController";

import { bookingService } from "./service/bookingService";
import { bookingRepository } from "./repository/bookingRepository";
//create container instance
let container = new Container();

container.bind<bookingService>(TYPES.bookingService).to(bookingService);

container
  .bind<bookingRepository>(TYPES.bookingRepository)
  .to(bookingRepository);

// Initialize the server
let server = new InversifyExpressServer(container);

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

// salesforceClientInstance.oauthLogin();

let app = server.build();
app.listen(process.env.VCAP_APP_PORT || 8080); //port allocation and server is listenning on this port
console.log(
  "Server Starting on : http://localhost:" + (process.env.VCAP_APP_PORT || 8080)
);
exports = module.exports = app;
