import { injectable, inject, id } from "inversify";
import { Request, Response } from "express";
import TYPES from "../constant/Types";
const path = require("path");
// const { v4: uuidv4 } = require("uuid");
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/users";
// import * as crypto from "crypto";
// import { sendOtp, getCurrentLocation } from "../utility/external_apis";
// import { string } from "joi";
// import redisClient from "../config/Redis";
import { PatnerRepository } from "../repository/patnerRepository";


@injectable()
export class PatnerService{
    private PatnerRepository = AppDataSource.getRepository(User);

    @inject(TYPES.PatnerRepository) private readonly patnerRepo: PatnerRepository;

public async addPatners(request: Request, response: Response) {
    const file = request.files['profile_picture'][0];
    const { patner_name, adhar_number, license_number, DOB, gender, rating } = request.body;
    console.log(patner_name, adhar_number, license_number, DOB, gender, rating, file.originalname,file.buffer)
    const filebuffer=(file.buffer).toString('base64')
     const patnerData={
      patner_name, adhar_number, license_number, DOB, gender, rating, "profile_picture":filebuffer
     }
     //console.log(patnerData)
      await this.patnerRepo.addPatners(patnerData);//adding patners data
    return "Hi ,Patner "

  }
}