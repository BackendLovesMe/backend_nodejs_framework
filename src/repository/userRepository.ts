import { injectable } from "inversify";
import { IDatabase } from "pg-promise";
import { User } from "../entities/users";
import { AppDataSource } from "../config/data-source";
import { Patners } from "../entities/patners";
import { number } from "joi";

@injectable()
export class UserRepository {
  private UserRepository = AppDataSource.getRepository(User);
  private PatenerRepository=AppDataSource.getRepository(Patners);
  //  private mongoDb: Db;
  // private postgresDb: IDatabase<any>;

  constructor() {
    // MongoDBClient.getMongoConnection(async (connection) => {
    //     this.mongoDb = connection;
    // });
    // PostgresDBClient.getPostgresConnection((connection) => {
    //     this.postgresDb = connection
    // });
  }


  public async getUserDeatails(phoneNumber) {
    const user = await this.UserRepository.findOneBy({phone:phoneNumber}); // Prepare a new user
    return user;
  }

  public async updateUser(number, data) {
    console.log(number, data);
    const user = await this.UserRepository.update({ phone: number }, data); // Prepare a new user
    return user;
  }

  public async deleteUser(id) {
    console.log(id);
    const user = await this.UserRepository.delete({ id: id }); // Prepare a new user
    return user;
  }

  
  public async verifyOtp(number, otp) {
    const res = await this.UserRepository.findOne({
      where: { phone: number },
      select: ["Otp"],
    });
    return res;
  }

  // public async addPatners(data){
  //   const patners= this.PatenerRepository.create(data);// Prepare a new user
  //   console.log("iam from repo ,",data,patners)
  //   return await this.PatenerRepository.save(patners);
  // }
}
