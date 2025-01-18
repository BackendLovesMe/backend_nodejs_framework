import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction, request, response } from "express";
import { bookingService } from "../service/bookingService";

import TYPES from "../constant/Types";
//import { authenticateJwt } from '../middleware/authenticateJwt';

@controller("/api/v1.0")
export class Controller {
  @inject(TYPES.bookingService) private bookingService: bookingService;

  @httpPost("/createBooking")
  public async createBooking(request: Request, response: Response) {
    return this.bookingService.createBooking(request, response);
  }

  @httpGet("/getBooking")
  public async getBooking(request: Request, response: Response) {
    return this.bookingService.getBooking(request, response);
  }

  @httpGet("/getBookingById")
  public async getBookingById(request: Request, response: Response) {
    return this.bookingService.getBookingById(request, response);
  }
  @httpDelete("/deleteById")
  public async deleteById(request: Request, response: Response) {
    return this.bookingService.deleteById(request, response);
  }
}
