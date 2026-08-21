import { Transaction } from "../entities/transaction.entity";


export interface TransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  updateStatus(id: string, status: Transaction['status']): Promise<void>;
  findByWalletId(walletId: string): Promise<Transaction[]>;
}