import { HttpStatus, Injectable } from "@nestjs/common";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user.repositry";
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from "../../presentation/dtos/login.dto";
import { LoginResponseDto } from "../../presentation/dtos/login-response.dto";
import { DomainException } from "../../common/exceptions/domain.exception";
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase{

    constructor(
        private readonly userRepository: UserRepositoryImpl,
        private readonly jwtService: JwtService
    ){}

    async execute(dto:LoginDto): Promise<LoginResponseDto>{
        try {

            const user = await this.userRepository.findByEmail(dto.email);
            if (!user) {
      throw new DomainException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new DomainException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
    const payLoad = {sub:user.id, email: user.email, role: user.role}
    const accessToken = this.jwtService.sign(payLoad)
    return new LoginResponseDto({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }); 
            
        } catch (error) {
        if (error instanceof DomainException) {
        throw error;
      }

      // For any unexpected error
      throw new DomainException(
        'An unexpected error occurred during login', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    }
}
}