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
}