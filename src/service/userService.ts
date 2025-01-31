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
    //console.log("this is My jwt payload",response.locals)
    const jwtPayloads = response.locals; // Accessing JWT payload data
    // Store JWT payload in class property
    console.log("What pay laod is comming ", jwtPayloads['jwt']['number'])
    const address = await getCurrentLocation(
      request.body.latitude,
      request.body.longitude
    );
    getUserData['Address'] = address
    console.log("USER DATA AFter chnages ", getUserData)

    const user = await this.userRepo.updateUser(jwtPayloads['jwt']['number'], getUserData);//adding user details to db 
    console.log("Lets seeeee",user['affected'])
    if(user['affected'] > 0){
    return response.status(200).send({
      message: "User Created ",
    });
  }else {
    return response.status(500).send({
      message: "Something Went Wrong !",
    });
  }
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






  



}
