import { injectable, inject, id } from "inversify";
import { Request, Response } from "express";
import TYPES from "../constant/Types";
const path = require("path");
const { v4: uuidv4 } = require("uuid");
import { bookingRepository } from "../repository/bookingRepository";
import { AppDataSource } from "../config/data-source";
import { Booking } from "../entities/booking";

@injectable()
export class bookingService {
  private UserRepository = AppDataSource.getRepository(Booking);

  @inject(TYPES.bookingRepository)
  private readonly bookingRepo: bookingRepository;
  public async createBooking(request: Request, response: Response) {
    const getBookingData = request.body;
    try {
      const user = await this.bookingRepo.createBooking(getBookingData); //adding user details to db
      if (!user) {
        return response.status(500).send({
          message: "Something Went Wrong!",
        });
      }
      return response.status(200).send({
        message: "Booking  Created ",
      });
    } catch (err) {
      console.log("Error", err.message);
    }
  }

  public async getBooking(request: Request, response: Response) {
    const { bookingDate, vendorName } = request.query;
    try {
      const bookingData = await this.bookingRepo.getBooking(
        bookingDate,
        vendorName
      ); //fetching details
      if (!bookingData) {
        return response.status(500).send({
          message: "Something Went Wrong!",
        });
      }
      return response.status(200).send({
        Details: bookingData,
      });
    } catch (err) {
      console.log("error ", err.message);
    }
  }

  public async getBookingById(request: Request, response: Response) {
    const { booking_id } = request.query;
    try {
      const bookingData = await this.bookingRepo.getBookingById(booking_id); //fetching details
      if (!bookingData) {
        return response.status(500).send({
          message: "Something Went Wrong!",
        });
      }
      return response.status(200).send({
        Details: bookingData,
      });
    } catch (err) {
      console.log("error ", err.message);
    }
  }

  public async deleteById(request: Request, response: Response) {
    const { booking_id } = request.query;
    try {
      const deleteById = await this.bookingRepo.deleteById(booking_id); //fetching details

      return response.status(200).send({
        message: "Deleted Sucessfully ",
      });
    } catch (err) {
      console.log("error ", err.message);
    }
  }
}
