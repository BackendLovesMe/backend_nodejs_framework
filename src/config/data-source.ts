import "reflect-metadata";
import { DataSource } from "typeorm";
import { User} from "../entities/users";
import { Patners } from "../entities/patners";
import { patenerVechiles } from "../entities/patnerVechiles";
import {Rides} from "../entities/rides"
 
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "database-1.cwdaq0q6ir1l.us-east-1.rds.amazonaws.com",
  port: 5432,
  username: "postgres",
  password: "12345678",
  database: "postgres",
  synchronize: true, // For development, set to false in production
  logging: false,
  entities: [User,Patners,patenerVechiles,Rides],
  ssl: {
    rejectUnauthorized: false, // Use only for development; ensure proper certificates in production
  },//use ssl when we are connection servere connection.
});
