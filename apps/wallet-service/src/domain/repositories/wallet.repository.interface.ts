import { Wallet } from '../entities/wallet.entity';

export interface WalletRepository {
  create(wallet: Wallet): Promise<Wallet>;
  findByUserId(userId: string): Promise<Wallet | null>;
  updateBalance(userId: string, amount: number): Promise<Wallet>;
  lockWallet(userId: string): Promise<void>;
  unlockWallet(userId: string): Promise<void>;
}