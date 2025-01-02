import { injectable } from "inversify";
import { AppDataSource } from "../config/data-source";
import { Patners } from "../entities/patners";

@injectable()
export class PatnerRepository{

  private PatenerRepository=AppDataSource.getRepository(Patners);

  public async addPatners(data){
    const patners= this.PatenerRepository.create(data);// Prepare a new user
    console.log("iam from repo ,",data,patners)
    return await this.PatenerRepository.save(patners);
  }
}