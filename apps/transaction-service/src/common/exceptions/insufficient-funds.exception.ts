import { DomainException } from './domain.exception';

export class InsufficientFundsException extends DomainException {
  constructor(walletId: string, requestedAmount: number, availableBalance: number) {
    super(
      `Insufficient funds in wallet ${walletId}. Requested: ${requestedAmount}, Available: ${availableBalance}`,
      400
    );
  }
}