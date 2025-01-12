import { string } from "joi";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate
} from "typeorm";
import * as bcrypt from 'bcrypt';
@Entity("users")
@Index("IDX_Mobile", ["phone"])
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ unique: true, nullable: true  })
  username: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  Address: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  Otp: string;
  @BeforeInsert()
  @BeforeUpdate()
  async encryptOtp() {
    if (this.Otp) {
      const otpToHash = String(this.Otp); // Ensure OTP is a string
      console.log("otpToHash", otpToHash)
      const salt = await bcrypt.genSalt(10);
       // Generate a salt with 10 rounds
      this.Otp = await bcrypt.hash(otpToHash, salt); // Hash the OTP with the salt
      return this.Otp
    }
  }
 


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
