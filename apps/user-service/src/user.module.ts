import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./infrastructure/persistence/config/database.config";
import { UserOrmEntity } from "./infrastructure/persistence/entities/user.orm-entity";
import { KycOrmEntity } from "./infrastructure/persistence/entities/kyc.orm-entity";
import { UserController } from "./infrastructure/controllers/user.controller";
import { RegisterUserUseCase } from "./application/use-cases";
import { UserRepositoryImpl } from "./infrastructure/repositories/user.repositry";
import { SubmitKycUseCase } from "./application/use-cases/submit-kyc.use-case";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { JwtModule } from "@nestjs/jwt";
import { UserRegisteredConsumer } from "./infrastructure/consumers/user-registered.consumers";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { ReviewKycUseCase } from "./application/use-cases/review-kyc.use-case";
import { KycController } from "./infrastructure/controllers/kyc.controller";
import { RedisModule } from "@nestjs-modules/ioredis";
import { GetUserProfileUseCase } from "./application/use-cases/get-user-profile.use-case";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";


export const USER_REPOSITORY = 'USER_REPOSITORY';
@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            useFactory:()=>databaseConfig,
        }),
        TypeOrmModule.forFeature([UserOrmEntity, KycOrmEntity]),
        JwtModule.register({
            secret:'your-secret-key-change-in-production',
            signOptions:{expiresIn:'1h'},
        }),
       RabbitMQModule.forRoot({
            exchanges: [{ name: 'nexuspay.exchange', type: 'topic' }],
            uri: process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672',
            connectionInitOptions: { wait: false },
    }),

        RedisModule.forRoot({
           type:'single',
           options:{
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
           }
        })
    ],
    controllers:[
        UserController,
        KycController
    ],
  providers: [
    RegisterUserUseCase,
    SubmitKycUseCase,
    UserRepositoryImpl,           // Direct registration (simplest way)
    JwtStrategy,    
    LoginUseCase,
    UserRegisteredConsumer,
    ReviewKycUseCase,
    GetUserProfileUseCase
  ],
})

export class UserModule{}