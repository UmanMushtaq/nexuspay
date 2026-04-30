import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class CreateUserDto{

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;

    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsNotEmpty()
    dateOfBirth!: string;
    
    @IsString()
    @IsNotEmpty()
    nationality!: string;   

    @IsString()
    @IsNotEmpty()
    phone!: string;
} 