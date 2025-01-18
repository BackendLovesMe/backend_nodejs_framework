import { string } from "joi";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn("increment")
  booking_id: number;

  @Column()
  customer_name: string;

  @Column()
  booking_date: string;

  @Column("decimal")
  amount: number;

  @Column()
  vendor: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
