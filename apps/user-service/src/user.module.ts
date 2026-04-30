import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./infrastructure/persistence/config/database.config";
import { UserOrmEntity } from "./infrastructure/persistence/entities/user.orm-entity";
import { KycOrmEntity } from "./infrastructure/persistence/entities/kyc.orm-entity";
import { UserController } from "./infrastructure/controllers/user.controller";
import { RegisterUserUseCase } from "./application/use-cases";
import { UserRepositoryImpl } from "./infrastructure/repositories/user.repositry";


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
    providers:[
RegisterUserUseCase,
{
    provide:'UserRepository',
    useClass: UserRepositoryImpl
}
    ],
})

export class UserModule{}