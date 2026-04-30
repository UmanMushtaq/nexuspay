

export class RegisterResponseDto{
    id!:string;
    email!:string;
    firstName!:string;
    lastName!:string;
    message!:string;

    constructor(partial:Partial<RegisterResponseDto>){
        Object.assign(this, partial);
    }
}