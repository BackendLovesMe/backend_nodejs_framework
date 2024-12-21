import "reflect-metadata";
import { DataSource } from "typeorm";
import { User} from "../entities/users";
import { Patners } from "../entities/patners";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345",
  database: "postgres",
  synchronize: true, // For development, set to false in production
  logging: true,
  entities: [User,Patners],
  // ssl: {
  //   rejectUnauthorized: false, // Use only for development; ensure proper certificates in production
  // },//use ssl when we are connection servere connection.
});
