import { AppDataSource } from "../config/data-source";
import { injectable, inject, id } from "inversify";
import { Request, Response } from "express";
import TYPES from "../constant/Types";
import { User } from "../entities/users";
import { UserRepository } from "../repository/userRepository";
import * as jwt from "jsonwebtoken";
import redisClient from "../config/Redis";
import * as crypto from "crypto";
import { sendOtp, getCurrentLocation } from "../utility/external_apis";
import { LoginRepository } from "../repository/loginRepository";
import { number } from "joi";
import { AwsPage } from "twilio/lib/rest/accounts/v1/credential/aws";
@injectable()
export class LoginService {
  private LoginRepository = AppDataSource.getRepository(User);
  private USerRepository = AppDataSource.getRepository(User);
  @inject(TYPES.LoginRepository) private readonly loginRepo: LoginRepository;
  @inject(TYPES.UserRepository) private readonly uesrRepo: UserRepository;


 

  public async sendOtp(request: Request, response: Response) {
    const phone = request.body.phoneNumber
    console.log("This is my Number ", phone)
    const Otp = await sendOtp(phone);//calling External api to (twilio)
    const data = { Otp, phone }// data to store in database
    const addOtpToDb = await this.loginRepo.addOtp(data)// storing data to db 
    console.log(addOtpToDb['Otp'], "OTP FROM DB  ")

    const dataToStore = {
      otp: addOtpToDb['Otp'],
      phone

    };
    await redisClient.setEx(// soring DataToStore in redis cache
      "number",
      3600,
      JSON.stringify(dataToStore)
    );
    if (!addOtpToDb) {
      return response.status(500).send({
        message: "Something Went Wrong ",
      });
    }
    return response.status(200).send({
      message: "OTP send Sucessfully ",
    });
  }

  public async verifyOtp(request: Request, response: Response) {
  
//console.log("****", number, "****");
   const dataFromRedis = await redisClient.get("number")
   const number=JSON.parse(dataFromRedis).phone
    const userData = await this.uesrRepo.getCredentials(number) //
    console.log("*****OTP******", userData['phone']);
   
     if(userData['phone'] === number){
    console.log(JSON.parse(dataFromRedis), "** REDIS DATA **")
    try {
      const { otp } = request.body
      if (!number || !otp!) {
        return response.status(400).json({ message: 'Number and OTP are required' });
      }
      console.log(otp, userData.Otp)
      if (!dataFromRedis) {
        return response.status(401).json({ message: ' OTP Expires' });
      }
      const isValidOtp = await this.loginRepo.verify(otp, JSON.parse(dataFromRedis).otp)

      if (isValidOtp) {
        const token = jwt.sign({ number }, process.env.JWTSECRETKEY, { expiresIn: "30d" });
        return response.status(200).json({ message: 'OTP is valid', token });
      } else {
        return response.status(401).json({ message: 'Invalid OTP' });
      }

    } catch (err) {
      console.log(err.message)
    }
  }else{
    return response.status(401).json({ message: 'Incorrect Number /OTP' });
  }
  }




}