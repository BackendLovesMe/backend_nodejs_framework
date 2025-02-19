import { injectable } from "inversify";
import { AppDataSource } from "../config/data-source";
import { Patners,} from "../entities/patners";
import { patenerVechiles } from "../entities/patnerVechiles";

@injectable()
export class PatnerRepository{

  private PatenerRepository=AppDataSource.getRepository(Patners);
  private VechileRepository=AppDataSource.getRepository(patenerVechiles);

  public async addPatners(data){
    const patners= this.PatenerRepository.create(data);// Prepare a new user
    console.log("iam from repo ,",data,patners)
    return await this.PatenerRepository.save(patners);
  }

  public async patanerVechiles(data){
    //console.log("Data from service",data)
    const vechilesData=this.VechileRepository.create(data)
    return await this.VechileRepository.save(vechilesData)
  }

  public async getVechiles(vechile_number,rc_number){
    console.log(vechile_number);
    return await this.VechileRepository.findOne({where:{vechile_number:vechile_number,rc_number:rc_number}})
    
  }
  public async getPatnerDetails(phone){
    const user = await this.PatenerRepository.findOneBy({phone:phone}); // Prepare a new user
    return user;
  }
  }
