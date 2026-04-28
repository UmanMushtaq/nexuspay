import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../../../domain/entities/user.entity";
import { Kyc } from "../../../domain/entities/kyc.entity";



export const databaseConfig: TypeOrmModuleOptions={
type: 'postgres',
host: 'localhost',
port: 5432,
username: 'postgres',
password: 'password',
entities: [User, Kyc],
synchronize: true, // Disable in production 
logging:true,
autoLoadEntities: true
}