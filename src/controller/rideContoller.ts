import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
  } from "inversify-express-utils";
  import { inject, injectable } from "inversify";
  import { Request, Response, NextFunction, request, response } from "express";

  
import TYPES from "../constant/Types";
import { RidesService } from "../service/ridesService";


@controller("/api/v2.0")
export class ridesController{

    @inject(TYPES.RidesService) private RidesService: RidesService;

    @httpPost("/rides")
    public async addPatners(request: Request, response: Response) {
    //   return this.RidesService.addPatners(request, response);
    }
}