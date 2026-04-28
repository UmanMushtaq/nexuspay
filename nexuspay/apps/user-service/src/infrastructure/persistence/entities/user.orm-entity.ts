import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { KycOrmEntity } from './kyc.orm-entity';


@Entity('users')
export class UserOrmEntity{
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @Column({unique:true})
    email!:string;

    @Column()
    passwordHash!:string;

    @Column()
    firstName!:string;
    
    @Column()
    lastName!:string;

    @Column()
    dateOfBirth!:Date;
    
    @Column()   
    nationality!:string;

    @Column()
    phone!:string;

    @Column({default: 'USER'})
    role!:string;

    @Column({default:'PENDING'})
    kycStatus!:string;
    
    @Column({default:false})
    isEmailVerified!:boolean;

    @OneToOne(() => KycOrmEntity, kyc =>kyc.user, {cascade:true, nullable:true})
    @JoinColumn()
    kyc?:KycOrmEntity;

    @Column({default:false})
    isPhoneVerified!:boolean;

    @CreateDateColumn()
    createdAt!:Date;

    @UpdateDateColumn()
    updatedAt!:Date;

}