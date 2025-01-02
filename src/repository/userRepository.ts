import { injectable } from "inversify";
import { IDatabase } from "pg-promise";
import { User } from "../entities/users";
import { AppDataSource } from "../config/data-source";
import { Patners } from "../entities/patners";

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

  //removed help and compliance schema changesd to common
  public async addUser(data) {
    console.log("User Data we are getting in repo ", data)
    const user = this.UserRepository.create(data); // Prepare a new user
    return await this.UserRepository.save(user);
  }

  public async getUser() {
    const user = await this.UserRepository.find(); // Prepare a new user
    return user;
  }

  public async updateUser(id, data) {
    console.log(id, data);
    const user = await this.UserRepository.update({ id: id }, data); // Prepare a new user
    return user;
  }

  public async deleteUser(id) {
    console.log(id);
    const user = await this.UserRepository.delete({ id: id }); // Prepare a new user
    return user;
  }

  public async addOtp(phone, otp) {
    await this.UserRepository.update({ phone }, { Otp: otp });
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