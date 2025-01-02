import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction, request, response } from "express";
import { userService } from "../service/userService";
import {
  validate,
  SchemaType,
  RequestReaderType,
  RequestReader,
} from "../validate";
import TYPES from "../constant/Types";
//import { authenticateJwt } from '../middleware/authenticateJwt';

@controller("/api/v1.0")
export class Controller {
  @inject(TYPES.Userservice) private userService: userService;

  @httpPost("/add/user")
  public async addUser(request: Request, response: Response) {
    console.log("Hey hey ");
    return this.userService.addUser(request, response);
  }

  @httpGet("/getUser")
  public async getUser(request: Request, response: Response) {
    return this.userService.getUser(request, response);
  }

  @httpGet("/verifyOtp")
  public async verifyOtp(request: Request, response: Response) {
    console.log("flow1")
    return this.userService.verifyOtp(request, response);
    
  }

  // @httpPost("/add/patners")
  // public async addPatners(request: Request, response: Response) {
  //   return this.userService.addPatners(request, response);
  // }



}

