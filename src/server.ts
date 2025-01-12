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
import * as jwt from "jsonwebtoken";
import TYPES from "./constant/Types";
import "./controller/Usercontroller";
import "./controller/patnerController"
import "./controller/loginController"
import { userService } from "./service/userService";
import { UserRepository } from "./repository/userRepository";
import { globalException } from "./exception/global_Exception";
import { PatnerService } from "./service/patnerService";
import { PatnerRepository } from "./repository/patnerRepository";
import { LoginService } from "./service/loginService";
import { Types } from "aws-sdk/clients/acm";
import { LoginRepository } from "./repository/loginRepository";

//create container instance
let container = new Container();

container.bind<userService>(TYPES.Userservice).to(userService);
container.bind<PatnerService>(TYPES.PatnerService).to(PatnerService);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<PatnerRepository>(TYPES.PatnerRepository).to(PatnerRepository);
container.bind<LoginService>(TYPES.LoginService).to(LoginService);
container.bind<LoginRepository>(TYPES.LoginRepository).to(LoginRepository);
// Initialize the server
let server = new InversifyExpressServer(container);

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".png" || ext === ".jpg" || ext === '.jfif') {
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
  app.use(upload.fields([{ name: "profile_picture", maxCount: 1 }])); //multer middleware for asset upload api
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
  app.use(function (request, response, next) {//jwt auth 
    console.log("In authorization function...")
    console.log(request.url);
    if (request.url.includes('/login') ||   request.url.includes('/sendOtp') || request.url.includes('/verifyOtp')/*||  request.url.includes('/add/user') || request.url.includes('/verifyOtp')*/) {
      console.log("Bypass this request ")
      next();
    } else {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        console.log('No Token Provided or Invalid Token...');
        return response.status(403).json({ message: "No token provided" })
      }
      const jwtPayload = <any>jwt.verify(token, process.env.JWTSECRETKEY,(err, jwtPayload)=>{
        console.log('========JWT PAYLOAD=========>\n',jwtPayload)
        request['user'] = jwtPayload//setting payload to request 
        if(err){
          console.log('Invalid Token...', err);
          return response.status(401).json({ message: "Unauthorized access" });
        }
        // request.user = jwtPayload;
        
        // Proceed to the next middleware or route handler
        next();
      });
     
      
    }
  })
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
