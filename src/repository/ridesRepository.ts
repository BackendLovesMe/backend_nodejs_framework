import { injectable } from "inversify";
import { AppDataSource } from "../config/data-source";
import {Rides} from "../entities/rides"

@injectable()
export class RidesRepository{
    private RidesRepository =AppDataSource.getRepository(Rides)
    
}