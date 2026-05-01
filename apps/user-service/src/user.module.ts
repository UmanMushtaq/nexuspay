import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./infrastructure/persistence/config/database.config";
import { UserOrmEntity } from "./infrastructure/persistence/entities/user.orm-entity";
import { KycOrmEntity } from "./infrastructure/persistence/entities/kyc.orm-entity";
import { UserController } from "./infrastructure/controllers/user.controller";
import { RegisterUserUseCase } from "./application/use-cases";
import { UserRepositoryImpl } from "./infrastructure/repositories/user.repositry";



export const USER_REPOSITORY = 'USER_REPOSITORY';
@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            useFactory:()=>databaseConfig,
        }),
        TypeOrmModule.forFeature([UserOrmEntity, KycOrmEntity])
    ],
    controllers:[
        UserController
    ],
  providers: [
    RegisterUserUseCase,
    UserRepositoryImpl,           // Direct registration (simplest way)
  ],
})

export class UserModule{}