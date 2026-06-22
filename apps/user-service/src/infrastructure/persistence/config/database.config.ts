import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../../../domain/entities/user.entity";
import { Kyc } from "../../../domain/entities/kyc.entity";
import { UserOrmEntity } from "../entities/user.orm-entity";
import { KycOrmEntity } from "../entities/kyc.orm-entity";



export const databaseConfig: TypeOrmModuleOptions={
type: 'postgres',
host: 'localhost',
database: 'user_db',
port: 5438,
username: 'postgres',
password: 'password',
entities: [UserOrmEntity, KycOrmEntity],
synchronize: true, // Disable in production 
logging:true,
autoLoadEntities: true
}