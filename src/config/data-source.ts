import "reflect-metadata";
import { DataSource } from "typeorm";
import { Booking } from "../entities/booking";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "PROCESS.env.HOST",
  port: 5432,
  username: "postgres",
  password: "PROCESS.env.PASSWORD",
  database: "postgres",
  synchronize: true, // For development, set to false in production
  logging: true,
  entities: [Booking],
  ssl: {
    rejectUnauthorized: false, // Use only for development; ensure proper certificates in production
  }, //use ssl when we are connection servere connection.
});
