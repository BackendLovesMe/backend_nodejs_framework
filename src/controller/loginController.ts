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

    @httpPost("/login")
    public async login(request: Request, response: Response) {
        console.log("** LOGIN CONTROLLER ")
        return this.LoginService.login(request,response)
    }
}
