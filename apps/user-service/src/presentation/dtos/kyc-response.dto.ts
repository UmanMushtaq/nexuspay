

export class KycResponseDto{
    id!:string;
    userId!:string;
    status!:string;
    message!:string;

    constructor(partial:Partial<KycResponseDto>){
        Object.assign(this,partial)
    }
}