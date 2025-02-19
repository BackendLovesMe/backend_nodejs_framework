import { number } from "joi";
import { Column, Decimal128, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('rides')
export class Rides {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    user_id: number

    @Column({nullable:true})
    patner_vechile_id: number

    @Column()
    source_location: string

    @Column()
    source_latitude: string

    @Column()
    source_longitude: string

    @Column()
    destinantion_location: string

    @Column()
    destination_latitude: string

    @Column()
    destinantion_longitude: string

    @Column()
    fare: number

    @Column({nullable:true})
    tip: number

    @Column({nullable:true})
    user_rating: number

    @Column({nullable:true})
    feedback:string

    @Column({nullable:true})
    patnerRating:number

    @Column({nullable:true})
    patner_start_longitude:string

    @Column({nullable:true})
    patner_start_latitude:string
    // @Column('geography', { spatialFeatureType: 'Point', srid: 4326 })
    //  location: string;
    @Column({})
    ride_status:string
    @Column({nullable:true})
    partnerId:number

}