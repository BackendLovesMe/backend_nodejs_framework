import { injectable } from "inversify";
import { IDatabase } from "pg-promise";
import { User } from "../entities/users";
import * as bcrypt from 'bcrypt';
import { AppDataSource } from "../config/data-source"; 

@injectable()
 export class LoginRepository{
    private LogingRepository =AppDataSource.getRepository(User)

    public async addOtp(data) {
        console.log("User Data we are getting in repo ", data.phone)
   const existingNumber= await this.LogingRepository.findOne({where:{phone:data.phone}})
      if(!existingNumber){
        console.log(`New Number ${data.phone}`);
        const user = this.LogingRepository.create(data); // Prepare a new user
        return await this.LogingRepository.save(user);
      }else{
        console.log(`Number ${data.phone} already exists`)
        const userToUpdate = await this.LogingRepository.findOne({ where: { phone: data.phone } });
        console.log(Object.keys,"object that is going to be modified")
        Object.keys(data).forEach(key => {
          if (data[key] !== undefined) { // Check if the property exists and is not undefined
              userToUpdate[key] = data[key];
          }
      });
        return await this.LogingRepository.save(userToUpdate);
      }
        
        
      }
    public   async  verify(inputOtp,dbOtp) {
        if (!inputOtp) {
          return false;
        }
        return bcrypt.compare((inputOtp.toString()), (dbOtp.toString())); // Compare hashed OTP with input
      }
    
 }