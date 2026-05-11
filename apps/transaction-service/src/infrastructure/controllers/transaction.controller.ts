import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from "@nestjs/common";
import { CreateTransactionUseCase } from "../../application/use-cases/create-transaction.use-case";
import { DomainException } from "../../common/exceptions/domain.exception";
import { CreateTransferCommand } from "../../application/commands/create-transfer.command";



@Controller('transactions')
export class TransactionController{
    private readonly logger = new Logger(TransactionController.name);

    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase
    ){}

    @Post('transfer')
    @HttpCode(HttpStatus.CREATED)
    async createTransfer(@Body() body:any){
        try {
            const command = new CreateTransferCommand(
        body.fromWalletId,
        body.toWalletId,
        body.amount,
        body.currency || 'USD',
        body.description,
        body.userId,           // Optional: who initiated
      );

      const transaction = await this.createTransactionUseCase.execute(command);

      return {
        success: true,
        message: 'Transfer initiated successfully',
        data: {
          transactionId: transaction.id,
          reference: transaction.reference,
          status: transaction.status,
          amount: transaction.amount,
          fromWalletId: transaction.fromWalletId,
          toWalletId: transaction.toWalletId,
        },
      };
        } catch (error: any) {
            this.logger.error(`Transfer failed: ${error.message}`);

      if (error instanceof DomainException) {
        throw error;
      }

      throw new DomainException('Failed to process transfer', HttpStatus.INTERNAL_SERVER_ERROR);
            
        }
    }
}