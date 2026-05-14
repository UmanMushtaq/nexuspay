import { IsNotEmpty, IsNumber, IsString, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto{

    @IsNotEmpty()
    @IsUUID()
    fromWalletId!: string;

    @IsNotEmpty()
    @IsUUID()
    toWalletId!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0.01)
    amount!:number;

    @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;
}