import { Column, Decimal128, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('patners')
export class Patners {
    @PrimaryGeneratedColumn("increment")
    id: number;
   
    @Column()
    patner_name: string
   
    @Column({ unique: true, nullable: false })
    adhar_number: string
   
    @Column()
    license_number:string
    
    @Column()
    DOB:Date
    
    @Column()
    gender: string
    
    @Column()
    rating:number
   
    @Column({ type: 'bytea' })
    profile_picture:Buffer
    
    // @Column('geography', { spatialFeatureType: 'Point', srid: 4326 })
    //  location: string;

}