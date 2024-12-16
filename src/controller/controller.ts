import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction, request, response } from "express";
import { Service } from "../service/service";
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
  @inject(TYPES.Service) private chatAppService: Service;

  @httpPost("/add/user")
  public async addUser(request: Request, response: Response) {
    console.log("Hey hey ");
    return this.chatAppService.addUser(request, response);
  }

  @httpGet("/getUser")
  public async getUser(request: Request, response: Response) {
    return this.chatAppService.getUser(request, response);
  }

  @httpGet("/updateUser")
  public async updateUser(request: Request, response: Response) {
    return this.chatAppService.updateUser(request, response);
  }

  @httpDelete("/deleteUser")
  public async deleteUser(request: Request, response: Response) {
    return this.chatAppService.deleteUser(request, response);
  }
  @httpGet("/verifyOtp")
  public async verifyOtp(request: Request, response: Response) {
    return this.chatAppService.verifyOtp(request, response);
  }
}
