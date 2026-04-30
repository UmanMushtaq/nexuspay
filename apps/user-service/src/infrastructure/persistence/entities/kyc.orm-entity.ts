import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserOrmEntity } from "./user.orm-entity";


@Entity('kyc')
export class KycOrmEntity{
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @Column()
    userId!:string;

    @OneToOne(()=>UserOrmEntity,user=>user.kyc)
    user!:UserOrmEntity;

    @Column()
    status!:string;

    @Column()
    idType!:string;
    
    @Column()
    idNumber!:string;
    @Column()
    idExpiry!:Date;
    @Column({nullable:true})
    idPhotoUrl?:string;
    @Column({nullable:true})
    selfieUrl?:string;
    @Column({nullable:true})
    addressProofUrl?:string;

      @Column({nullable:true})
    reviewedBy?:string;

    @Column({nullable:true})
    reviewedAt?:Date;

    @Column({nullable:true})
    rejectionReason?:string;

    @Column()
    submittedAt!:Date

    @CreateDateColumn()
    createdAt!:Date;
    @UpdateDateColumn()
    updatedAt!:Date;

  
}