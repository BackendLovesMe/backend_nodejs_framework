import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/users";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "eviandb.c3m0g24emq3l.us-east-1.rds.amazonaws.com",
  port: 5432,
  username: "postgres",
  password: "12345678",
  database: "postgres",
  synchronize: true, // For development, set to false in production
  logging: true,
  entities: [User],
  ssl: {
    rejectUnauthorized: false, // Use only for development; ensure proper certificates in production
  },
});
