import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction, request, response } from "express";
import {
  validate,
  SchemaType,
  RequestReaderType,
  RequestReader,
} from "../validate";
import TYPES from "../constant/Types";
import { PatnerService } from "../service/patnerService";
@controller("/api/v2.0")
export class patnersController {
  @inject(TYPES.PatnerService) private PatnerService: PatnerService;



  @httpPost("/add/patners")
  public async addPatners(request: Request, response: Response) {
    return this.PatnerService.addPatners(request, response);
  }

  @httpPost("/patner/vechiles")
  public async patenerVechiles(request: Request, response: Response) {
    console.log("checking ...")
    return this.PatnerService.patanerVechiles(request, response);
  }
  @httpPost("/driverLogout")
  public async driverLogout(request: Request, response: Response){
    return this.PatnerService.driverLogout(request, response);
  }
  @httpPost('/currentLocationProducer')
  public async currentDriverLocationProducer(request: Request, response: Response){
    return this.PatnerService.currentLocationProducer(request, response);

  }
  @httpGet('/currentLocationConsumer')
  public async currentLocationConsumer(request: Request, response: Response){
    return this.PatnerService.currentLocationConsumer(request, response);
  }
  

}
