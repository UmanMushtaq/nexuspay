import { Wallet } from '../entities/wallet.entity';

export type TransferOutcome =
  | 'OK'
  | 'DUPLICATE'
  | 'SENDER_NOT_FOUND'
  | 'RECEIVER_NOT_FOUND'
  | 'INSUFFICIENT_FUNDS';

export interface TransferRequest {
  transactionId: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
}

export interface RefundRequest {
  transactionId: string;
  walletId: string;
  amount: number;
}

export interface WalletRepository {
  create(wallet: Wallet): Promise<Wallet>;
  findByUserId(userId: string): Promise<Wallet | null>;
  updateBalance(userId: string, amount: number): Promise<Wallet>;
  lockWallet(userId: string): Promise<void>;
  unlockWallet(userId: string): Promise<void>;
  deductBalance(userId: string, amount: number): Promise<Wallet>;
  findById(id: string): Promise<Wallet | null>;
  transfer(request: TransferRequest): Promise<TransferOutcome>;
  refund(request: RefundRequest): Promise<'OK' | 'DUPLICATE' | 'WALLET_NOT_FOUND'>;
}
