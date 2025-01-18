import { injectable } from "inversify";
import { Booking } from "../entities/booking";
import { AppDataSource } from "../config/data-source";

@injectable()
export class bookingRepository {
  private bookingRepository = AppDataSource.getRepository(Booking);

  constructor() {}
  public async createBooking(data) {
    console.log("** Booking  Data ** ", data);
    const booking = this.bookingRepository.create(data); // Prepare a new user
    return await this.bookingRepository.save(booking);
  }

  public async getBooking(bookingDate, vendorName) {
    console.log("** Booking  Data ** ", bookingDate, vendorName);
    return await this.bookingRepository.find({
      where: {
        booking_date: bookingDate, // Assuming this is a Date column
        vendor: vendorName, // Assuming this is a string column
      },
    });
  }

  public async getBookingById(booking_id) {
    console.log("** Booking  Data ** ", booking_id);
    return await this.bookingRepository.findOne({
      where: {
        booking_id: booking_id, // Adjust to your column name if it's different
      },
    });
  }

  public async deleteById(booking_id) {
    console.log("** Booking  Data ** ", booking_id);
    return await this.bookingRepository.delete({
      booking_id: booking_id, // Adjust to your column name if it's different
    });
  }
}
