import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../../../domain/entities/user.entity";
import { Kyc } from "../../../domain/entities/kyc.entity";
import { UserOrmEntity } from "../entities/user.orm-entity";
import { KycOrmEntity } from "../entities/kyc.orm-entity";



export const databaseConfig: TypeOrmModuleOptions={
type: 'postgres',
host: process.env.DB_HOST || 'localhost',
database: 'user_db',
port: Number(process.env.DB_PORT) || 5438,
username: 'postgres',
password: process.env.DB_PASSWORD || 'password',
entities: [UserOrmEntity, KycOrmEntity],
synchronize: true, // Disable in production 
logging:true,
autoLoadEntities: true
}