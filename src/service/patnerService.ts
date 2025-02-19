import { injectable, inject, id } from "inversify";
import { Request, Response } from "express";
import TYPES from "../constant/Types";
const path = require("path");
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/users";
import { PatnerRepository } from "../repository/patnerRepository";
import { patenerVechiles } from "../entities/patnerVechiles";



@injectable()
export class PatnerService {
  private PatnerRepository = AppDataSource.getRepository(User);


  @inject(TYPES.PatnerRepository) private readonly patnerRepo: PatnerRepository;

  public async addPatners(request: Request, response: Response) {
    const file = request.files['profile_picture'][0];
    const { patner_name, adhar_number, license_number, DOB, gender, rating,current_lat,current_lng, status,phone} = request.body;
    console.log(patner_name, adhar_number, license_number, DOB, gender, rating, file.originalname, file.buffer,current_lat,current_lng)
    const filebuffer = (file.buffer).toString('base64')
    const patnerData = {
      patner_name, adhar_number, license_number, DOB, gender, rating, "profile_picture": filebuffer,current_lat,current_lng,status,phone
    }
    //console.log(patnerData)
    await this.patnerRepo.addPatners(patnerData);//adding patners data
    return response.status(200).json({ message: 'patner added Sucessfully ' });

  }

  public async patanerVechiles(request: Request, response: Response) {
    const file = request.files
    const { company_name, vechile_number, rc_number, model_number } = request.body;
    const vechile_picture = file['vechile_picture'][0]['buffer']
    //console.log("***************",vechile_picture);
    //console.log(company_name,vechile_number,rc_number,vechile_picture)

    const data = { company_name, vechile_number, rc_number, model_number, vechile_picture }
    const alreadyExistVichle = await this.patnerRepo.getVechiles(vechile_number,rc_number)
    console.log("alreadyExistVichle",alreadyExistVichle);
    if (alreadyExistVichle) {
      return response.status(200).json({ message: 'Vechile already Exits' });

    }else {
      const saveVechile = await this.patnerRepo.patanerVechiles(data);
    return response.status(200).json({ message: 'Vichle added' });}
  } catch(err) {
    console.log("error", err.message)
  }

}
