import { TransactionStatus } from './transaction-status.enum';
import { TransactionType } from './transaction-type.enum';

export class Transaction{
    readonly id!: string;
  fromWalletId!: string;
  toWalletId!: string;
  amount!: number;
  currency!: string;
  type!: TransactionType;
  status!: TransactionStatus;
  reference!: string;
  metadata?: any;

  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<Transaction> = {}) {
    Object.assign(this, partial);
    this.status = this.status || TransactionStatus.PENDING;
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
  }
}