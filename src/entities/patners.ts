import { Column, Decimal128, Entity, PrimaryGeneratedColumn } from "typeorm";
export enum StatusEnum {
    ON_DUTY = "onDuty",
    OFF_DUTY = "offDuty",
  }
  
@Entity("patners")
export class Patners {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  patner_name: string;

  @Column({ unique: true, nullable: false })
  adhar_number: string;

  @Column()
  license_number: string;

  @Column()
  DOB: Date;

  @Column()
  gender: string;

  @Column()
  rating: number;

  @Column({ type: "bytea" })
  profile_picture: Buffer;

  @Column({nullable:true})
  current_lat: string;
  @Column({nullable:true})
  current_lng: string;

  @Column({type:"enum",enum:StatusEnum,default:StatusEnum.OFF_DUTY})//only offduty and onduty 
  status: StatusEnum

  @Column({nullable:true})
  phone: string;
  @Column({ type: "boolean", default: false })//only true and false 
  isActive: boolean;
}
