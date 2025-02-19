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


@controller("/api/v4.0")
export class ridesController {

  @inject(TYPES.RidesService) private ridesService: RidesService;

  @httpPost("/requestRide")
  public async requestRide(request: Request, response: Response) {
    console.log("Rides Controller")
    return this.ridesService.requestRide(request, response);
  }

  @httpGet('/driverLoaction')
  public async driverLocation(request: Request, response: Response){
    return this.ridesService.driverLoaction(request, response)
  }

  @httpGet('/notifyDrivers')
  public async notifyDrivers(request:Request,response:Response){
    return this.ridesService.notifyDrivers(request,response)
  }

  @httpGet('/acceptRide')
  public async acceptRide(request:Request,response:Response){
    return this.ridesService.acceptRide(request,response);
  }

  



}