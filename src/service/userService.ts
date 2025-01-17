import { injectable, inject, id } from "inversify";
import { Request, Response } from "express";
import TYPES from "../constant/Types";
const path = require("path");
const { v4: uuidv4 } = require("uuid");
import { UserRepository } from "../repository/userRepository";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/users";
import * as crypto from "crypto";
import { sendOtp, getCurrentLocation } from "../utility/external_apis";
import { string } from "joi";
import redisClient from "../config/Redis";
import { commandOptions } from "redis";

@injectable()
export class userService {
  private UserRepository = AppDataSource.getRepository(User);

  @inject(TYPES.UserRepository) private readonly userRepo: UserRepository;
  
  public async addUser(request: Request, response: Response) {

    const getUserData = request.body;
    console.log("this is My jwt payload",response.locals)
    const jwtPayloads = request['user']; // Accessing JWT payload data
    // Store JWT payload in class property
    console.log("What pay laod is comming ", jwtPayloads['number'])
    const address = await getCurrentLocation(
      request.body.latitude,
      request.body.longitude
    );
    getUserData['Address'] = address
    console.log("USER DATA AFter chnages ", getUserData)

    const user = await this.userRepo.updateUser(jwtPayloads['number'], getUserData);//adding user details to db 

    return response.status(200).send({
      message: "User Created ",
    });
  }
 
  public async getUserData(request: Request, response: Response) {
    //const jwtPayload = request['user'];
    const { number } = response.locals.jwt;
    console.log("this is My jwt payload",number);
    const userData=await this.userRepo.getUserDeatails(number)
    console.log("User Data ",userData);
    try{
    if(!userData){
      return response.status(500).send({
        message: "User Dees not exists ",
      });
    }else {
      return response.status(200).send({
        Data:userData,
      });
    }
  }catch(err){
    console.log("**ERRROR **", err.message)
  }

  }






  // public async verifyOtp(request: Request, response: Response) {
  //   console.log("flow2")
  //   const data = request.query;

  //   console.log("****", data, "****");
  //   const otp = await this.userRepo.verifyOtp(data.number, data.otp); //
  //   console.log("*****OTP******", otp.Otp);
  //   console.log("******SPLIT STRING*****", otp.Otp.toString());
  //   try {
  //     let otpString = otp.Otp.toString();
  //     const [ivHex, encryptedData] = otpString.split(":");
  //     const phoneNumber = data.number.toString();
  //     const redisData = JSON.parse(await redisClient.get(phoneNumber));
  //     const keyBuffer = Buffer.from(redisData.encryptionKey, "hex");
  //     console.log("** REDIS DATA **", redisData.encryptionKey);
  //     const iv = Buffer.from(ivHex, "hex");
  //     const encryptedBuffer = Buffer.from(encryptedData, "hex");
  //     console.log(
  //       "*****IV *** ENCRYPTED_BUFFER_DATA **",
  //       ivHex,
  //       encryptedBuffer
  //     );
  //     console.log("*** IV BUFFER AND ENCRYPTED  BUFFER ** ", iv, keyBuffer);

  //     const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);

  //     const decryptedData = Buffer.concat([
  //       decipher.update(encryptedBuffer),
  //       decipher.final(),
  //     ]);
  //     const res = decryptedData.toString("utf-8");
  //     console.log("** DECREPTED DATA ** ", res);
  //     if (data.otp === res) {
  //       return response.send({
  //         message: "OTP Verified sucessfully",
  //       });
  //     } else if (redisData === null) {
  //       return response.send({
  //         message: "OTP Expired ",
  //       });
  //     } else {
  //       return response.send({
  //         message: "Incorrect OT",
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }



}
