import { Column, Decimal128, Entity, PrimaryGeneratedColumn,UpdateDateColumn,
    CreateDateColumn } from "typeorm";

@Entity('patener_vechiles')
export class patenerVechiles {
    @PrimaryGeneratedColumn("increment")
    id: number;
   
    @Column()
    company_name: string
   
    @Column()
    model_number: string
   
    @Column({unique: true})
    vechile_number:string
    
    @Column()
    rc_number:string
    
    @Column({ type: 'bytea' })
    vechile_picture: Buffer

    @CreateDateColumn()
      createdAt: Date;
    
    @UpdateDateColumn()
      updatedAt: Date;
   

}