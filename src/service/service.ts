import { injectable, inject, id } from "inversify";
import { Request, Response } from "express";
import TYPES from "../constant/Types";
const path = require("path");
const { v4: uuidv4 } = require("uuid");
import { repository } from "../repository/Repository";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/users";
import * as crypto from "crypto";
import { sendOtp, getCurrentLocation } from "../utility/external_apis";
import { string } from "joi";
import redisClient from "../config/Redis";

@injectable()
export class Service {
  private UserRepository = AppDataSource.getRepository(User);

  @inject(TYPES.repository) private readonly chatAppRepo: repository;

  public async addUser(request: Request, response: Response) {
    const getUserData = request.body;
    const ENCRYPTION_KEY = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    console.log("** ENCRYPTION_KEY **", ENCRYPTION_KEY);

    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

    const address = await getCurrentLocation(
      request.body.latitude,
      request.body.longitude
    );
    getUserData['Address']=address
    console.log("USER DATA AFter chnages ",getUserData)

    const user = await this.chatAppRepo.addUser(getUserData);//adding user details to db 
    //Calling external api to Send OTP 
    const Otp = await sendOtp(getUserData.phone, getUserData.username); 
    console.log("See my otp ", Otp.toString());

    //Encryption of otp
    let encrypted = cipher.update(Otp.toString(), "utf8", "hex");
    encrypted += cipher.final("hex");
    console.log("OTP Encrypted", encrypted);
    console.log("OTP IV", iv.toString("hex"));
    await this.chatAppRepo.addOtp(
      getUserData.phone,
      `${iv.toString("hex")}:${encrypted} `
    );

    //storing dataToStore  to redis
    const dataToStore = {
      encryptionKey: ENCRYPTION_KEY.toString("hex"), // Store as hex string
      encryptedOtp: `${iv.toString("hex")}:${encrypted} `, // Store the encrypted OTP
    };

    console.log(dataToStore);
    await redisClient.setEx(
      getUserData.phone,
      3600,
      JSON.stringify(dataToStore)
    );

    return response.status(200).send({
      message: "User Created ",
    });
  }

  public async getUser(request: Request, response: Response) {
    //const getUserData=request.body;

    const user = await this.chatAppRepo.getUser();
    return response.status(200).send({
      user,
    });
  }

  public async updateUser(request: Request, response: Response) {
    const UserId = request.headers.id;
    const updateData = request.body;

    const user = await this.chatAppRepo.updateUser(UserId, updateData);
    return response.status(200).send({
      user,
    });
  }

  public async deleteUser(request: Request, response: Response) {
    const UserId = request.headers.id;

    const user = await this.chatAppRepo.deleteUser(UserId);
    return response.status(200).send({
      user,
    });
  }

  public async verifyOtp(request: Request, response: Response) {
    const data = request.query;

    console.log("****", data, "****");
    const otp = await this.chatAppRepo.verifyOtp(data.number, data.otp); //
    console.log("*****OTP******", otp.Otp);
    console.log("******SPLIT STRING*****", otp.Otp.toString());
    try {
      let otpString = otp.Otp.toString();
      const [ivHex, encryptedData] = otpString.split(":");
      const phoneNumber = data.number.toString();
      const redisData = JSON.parse(await redisClient.get(phoneNumber));
      const keyBuffer = Buffer.from(redisData.encryptionKey, "hex");
      console.log("** REDIS DATA **", redisData.encryptionKey);
      const iv = Buffer.from(ivHex, "hex");
      const encryptedBuffer = Buffer.from(encryptedData, "hex");
      console.log(
        "*****IV *** ENCRYPTED_BUFFER_DATA **",
        ivHex,
        encryptedBuffer
      );
      console.log("*** IV BUFFER AND ENCRYPTED  BUFFER ** ", iv, keyBuffer);

      const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);

      const decryptedData = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final(),
      ]);
      const res = decryptedData.toString("utf-8");
      console.log("** DECREPTED DATA ** ", res);
      if (data.otp === res) {
        return response.send({
          message: "OTP Verified sucessfully",
        });
      } else if (redisData === null) {
        return response.send({
          message: "OTP Expired ",
        });
      } else {
        return response.send({
          message: "Incorrect O",
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
