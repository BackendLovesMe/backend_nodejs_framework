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
export class LoginService{
      private LoginRepository = AppDataSource.getRepository(User);
      private USerRepository=AppDataSource.getRepository(User);
      @inject(TYPES.LoginRepository) private readonly loginRepo: LoginRepository;
      @inject(TYPES.UserRepository) private readonly uesrRepo: UserRepository;


public async verifyOtp(request: Request, response: Response) {
    console.log("flow2")
    const { number, Otp } = request.body;

    console.log("****",number , "****");
    const userData= await this.uesrRepo.getCredentials(number) //
    console.log("*****OTP******", userData);
   // console.log("******SPLIT STRING*****", otp.Otp.toString());
    // try {
    //   let otpString = otp.Otp.toString();
    //   const [ivHex, encryptedData] = otpString.split(":");
    //   const phoneNumber = data.number.toString();
    //   const redisData = JSON.parse(await redisClient.get(phoneNumber));
    //   const keyBuffer = Buffer.from(redisData.encryptionKey, "hex");
    //   console.log("** REDIS DATA **", redisData.encryptionKey);
    //   const iv = Buffer.from(ivHex, "hex");
    //   const encryptedBuffer = Buffer.from(encryptedData, "hex");
    //   console.log(
    //     "*****IV *** ENCRYPTED_BUFFER_DATA **",
    //     ivHex,
    //     encryptedBuffer
    //   );
    //   console.log("*** IV BUFFER AND ENCRYPTED  BUFFER ** ", iv, keyBuffer);

    //   const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);

    //   const decryptedData = Buffer.concat([
    //     decipher.update(encryptedBuffer),
    //     decipher.final(),
    //   ]);
    //   const res = decryptedData.toString("utf-8");
    //   console.log("** DECREPTED DATA ** ", res);

    //   if (data.otp === res) {
    //     const token = jwt.sign({phoneNumber}, process.env.JWTSECRETKEY, { expiresIn: "15d" });
    //     return response.send({
    //       message: "OTP Verified sucessfully",
    //       token:token
    //     });
        
    
        
    //   } else if (redisData === null) {
    //     return response.send({
    //       message: "OTP Expired ",
    //     });
    //   } else {
    //     return response.send({
    //       message: "Incorrect OTP",
    //     });
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
    const dataFromRedis=await redisClient.get(number)
    console.log(JSON.parse(dataFromRedis),"** REDIS DATA **")
    try{
        const { number, otp } = request.body
        if (!number|| !otp !) {
            return response.status(400).json({ message: 'userId and OTP are required' });
          }
          console.log(otp,userData.Otp)
          if(!dataFromRedis){
            return response.status(401).json({ message: ' OTP Expires' });
          }
      const isValidOtp= await this.loginRepo.verify(otp,JSON.parse(dataFromRedis).otp)
      
      if (isValidOtp) {
        const token = jwt.sign({number}, process.env.JWTSECRETKEY, { expiresIn: "1h" });
        return response.status(200).json({ message: 'OTP is valid',token });
      } else {
        return response.status(401).json({ message: 'Invalid OTP' });
      }

    }catch(err){
        console.log(err.message)
    }
  }

  public async sendOtp(request: Request, response: Response) {
      const phone = request.body.phoneNumber
      // const ENCRYPTION_KEY = crypto.randomBytes(32);
      // const iv = crypto.randomBytes(16);
      // const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  
  
      console.log("This is my Number ", phone)
  
      const Otp = await sendOtp(phone);//calling External api to (twilio)
      const data={Otp,phone}// data to store in database
      const addOtpToDb=await this.loginRepo.addOtp(data)// storing data to db 
    console.log(addOtpToDb['Otp'],"dekho ")
      //Encryption of otp
  //let encrypted = cipher.update(Otp.toString(), "utf8", "hex");
     // encrypted += cipher.final("hex");
     // console.log("OTP Encrypted", encrypted);
     // console.log("OTP IV", iv.toString("hex"));
      // await this.userRepo.addOtp(//putting encrypted otp to db where phonenumber 
      //   phoneNumber,
      //   `${iv.toString("hex")}:${encrypted} `
      // );
      
      // storing dataToStore  to redis
      
      const dataToStore = {
        phone,
        otp:addOtpToDb['Otp'],
           
      };
      await redisClient.setEx(
          phone,
          3600,
          JSON.stringify(dataToStore)
        );
      if(!addOtpToDb){
        return response.status(500).send({
            message: "Something Went Wrong ",
          });
      }
      return response.status(200).send({
        message: "OTP send Sucessfully ",
      });
    }


  

}