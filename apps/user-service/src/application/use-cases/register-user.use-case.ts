
import { KycStatus } from "../../domain/entities/KycStatus.enum";
import { User } from "../../domain/entities/user.entity";
import { UserRole } from "../../domain/entities/UserRole.enum";
import { UserRepository } from "../../domain/repositories/user.repository.interface";
import { CreateUserDto } from "../../presentation/dtos/create-user.dto";
import { RegisterResponseDto } from "../../presentation/dtos/register-response.dto";
import * as bcrypt from 'bcrypt';


export class RegisterUserUseCase {

    constructor(private readonly userRepository:UserRepository){}


    async execute (dto:CreateUserDto): Promise<RegisterResponseDto>{

        const existingUser= await this.userRepository.findByEmail(dto.email)
        if (existingUser){
            throw new Error('Email already in use');
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
        return new RegisterResponseDto({
            id: createdUser.id,
            email: createdUser.email,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            message: 'User registered successfully'
        })
    }
}