import { number } from "joi";
import { Column, Decimal128, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('rides')
export class Rides {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    user_id: number

    @Column()
    patnerVechileId: number

    @Column()
    sourceLocation: string

    @Column()
    sourceLatitude: string

    @Column()
    sourceLongitude: string

    @Column()
    destinantionLocation: string

    @Column()
    destinationLatitude: string

    @Column()
    destinantionLongitude: string

    @Column()
    fare: number

    @Column()
    tip: number

    @Column()
    user_rating: number

    @Column()
    feedback:string

    @Column()
    patnerRating:number

    @Column()
    patnerStartLongitude:string

    @Column()
    patnerStartLatitude:string
    // @Column('geography', { spatialFeatureType: 'Point', srid: 4326 })
    //  location: string;

}