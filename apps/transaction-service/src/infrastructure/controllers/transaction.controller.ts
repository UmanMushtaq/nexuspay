import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateTransactionUseCase } from "../../application/use-cases/create-transaction.use-case";
import { DomainException } from "../../common/exceptions/domain.exception";
import { CreateTransferCommand } from "../../application/commands/create-transfer.command";
import { CreateTransactionDto } from "../../application/dtos/create-transaction.dto";
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetTransactionHistoryUseCase } from '../../application/use-cases/get-transaction-history.use-case';


@Controller('transactions')
export class TransactionController{
    private readonly logger = new Logger(TransactionController.name);

    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
         private readonly getTransactionHistoryUseCase: GetTransactionHistoryUseCase,
    ){}

    @Post('transfer')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async createTransfer(@Body() body:CreateTransactionDto){
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

    @Get(':walletId/history')
    @UseGuards(JwtAuthGuard)
async getTransactionHistory(@Param('walletId') walletId: string) {
  try {
    const transactions = await this.getTransactionHistoryUseCase.execute(walletId);
    return {
      success: true,
      walletId,
      count: transactions.length,
      data: transactions.map(t => ({
        transactionId: t.id,
        reference: t.reference,
        status: t.status,
        type: t.type,
        amount: t.amount,
        currency: t.currency,
        fromWalletId: t.fromWalletId,
        toWalletId: t.toWalletId,
        createdAt: t.createdAt,
      })),
    };
  } catch (error: any) {
    this.logger.error(`Failed to fetch history: ${error.message}`);
    throw new DomainException('Failed to fetch transaction history', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
}