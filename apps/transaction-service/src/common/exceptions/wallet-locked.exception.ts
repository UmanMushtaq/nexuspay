import { DomainException } from './domain.exception';

export class WalletLockedException extends DomainException {
  constructor(walletId: string) {
    super(`Wallet ${walletId} is currently locked. Please try again later.`, 409);
  }
}