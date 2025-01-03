import { AppDataSource } from "../config/data-source";
import { injectable, inject, id } from "inversify";
import { Request, Response } from "express";
import TYPES from "../constant/Types";
import { User } from "../entities/users";
import { UserRepository } from "../repository/userRepository"; 
import * as jwt from "jsonwebtoken";

@injectable()
export class LoginService{
      private UserRepository = AppDataSource.getRepository(User);
      @inject(TYPES.UserRepository) private readonly userRepo: UserRepository;

 public async login(request: Request, response: Response){
    const {username,password}=request.body
    console.log(username,password)
    const getCredentialsFromDb= await this.userRepo.getCredentials(username,password);
    console.log("** ALL DATA **",username,password,getCredentialsFromDb);
    if(!getCredentialsFromDb){
        return response.status(401).json({ message: "Invalid credentials" });
    }else{
        const token = jwt.sign({ username,password}, process.env.JWTSECRETKEY, { expiresIn: "1h" });
     return response.json({ token });
        
    }


 }

}