import { injectable } from "inversify";
import { IDatabase } from "pg-promise";
import { User } from "../entities/users";
import * as bcrypt from 'bcrypt';
import { AppDataSource } from "../config/data-source"; 

@injectable()
 export class LoginRepository{
    private LogingRepository =AppDataSource.getRepository(User)

    public async addOtp(data) {
        console.log("User Data we are getting in repo ", data)
        const user = this.LogingRepository.create(data); // Prepare a new user
        return await this.LogingRepository.save(user);
      }
    public   async  verify(inputOtp,dbOtp) {
        if (!inputOtp) {
          return false;
        }
        return bcrypt.compare((inputOtp.toString()), (dbOtp.toString())); // Compare hashed OTP with input
      }
    
 }