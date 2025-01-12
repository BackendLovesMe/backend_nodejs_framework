import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
} from "inversify-express-utils";
import { LoginService } from '../service/loginService'
import TYPES from '../constant/Types'
import { inject } from "inversify";
import { Request, Response, NextFunction, request, response } from "express";


@controller("/api/v3.0")
export class loginController {

    @inject(TYPES.LoginService) private LoginService: LoginService;



    @httpPost("/sendOtp")
  public async sendOtp(request: Request, response: Response){
    return this.LoginService.sendOtp(request, response)
  }

    @httpGet("/verifyOtp")
    public async verifyOtp(request: Request, response: Response) {
        console.log("flow1")
        return this.LoginService.verifyOtp(request, response);

    }
}