
import {  HttpStatus, Injectable } from "@nestjs/common";
import { KycStatus } from "../../domain/entities/KycStatus.enum";
import { User } from "../../domain/entities/user.entity";
import { UserRole } from "../../domain/entities/UserRole.enum";

import { CreateUserDto } from "../../presentation/dtos/create-user.dto";
import { RegisterResponseDto } from "../../presentation/dtos/register-response.dto";
import * as bcrypt from 'bcrypt';

import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repositry";
import { DomainException } from "../../common/exceptions/domain.exception";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { rabbitMQConfig } from "../../infrastructure/config/rabbitmq.config";




@Injectable()
export class RegisterUserUseCase {

    private client: ClientProxy
 constructor(
  private readonly userRepository: UserRepositoryImpl  // No @Inject needed now
) {}
   onModuleInit(){
   this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMQConfig.url],
        queue: rabbitMQConfig.queue,
        queueOptions: { durable: true },
      },
    });
   } 


    async execute (dto:CreateUserDto): Promise<RegisterResponseDto>{
        try {
            
        const existingUser= await this.userRepository.findByEmail(dto.email)
        if (existingUser){
            throw new DomainException('Email already in use');
        }

        const saltRounds = 10;
        const passwordHash = await  bcrypt.hash(dto.password, saltRounds);

        const user = new User({
            email:dto.email,
            passwordHash,
            firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: new Date(dto.dateOfBirth),
      nationality: dto.nationality,
      phone: dto.phone,
      role: UserRole.USER,
      kycStatus: KycStatus.PENDING,
      isEmailVerified: false,
      isPhoneVerified: false,
        })
        const createdUser = await this.userRepository.create(user)

        this.client.emit('user.registered',{
            userId:createdUser.id,
            email:createdUser.email,
            firstName:createdUser.firstName,
            timestamp: new Date(),
            event: 'user.registered'
        })

        return new RegisterResponseDto({
            id: createdUser.id,
            email: createdUser.email,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            message: 'User registered successfully'
        })
        } catch (error) {
            if (error instanceof DomainException){
                throw error; // Re-throw known domain exceptions
            }
            throw new DomainException('An unexpected error occurred during registration', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}