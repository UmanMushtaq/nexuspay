import { DomainException } from '../../common/exceptions/domain.exception';
import { TransactionStatus } from './transaction-status.enum';
import { TransactionType } from './transaction-type.enum';

export class Transaction{
    readonly id!: string;
    readonly reference!: string;
  fromWalletId!: string;
  toWalletId!: string;
  amount!: number;
  currency!: string;
  type!: TransactionType;
  status!: TransactionStatus;
  metadata?: any;

  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<Transaction> = {}) {
    Object.assign(this, partial);
    this.status = this.status || TransactionStatus.PENDING;
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
    this.validate()
  }
  static create(fromWalletId:string, toWalletId:string, amount:number,
    type:TransactionType.TRANSFER, currency:string = 'USD',description?:string
  ):Transaction
  {
    if (amount<=0){
      throw new DomainException('Transaction amount must be greater than zero')
    }
    if (fromWalletId ===toWalletId){
      throw new DomainException('Source and target wallet cannot be the same')
    }
    return new Transaction({
      id: crypto.randomUUID(),
      reference :`TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      fromWalletId,
      toWalletId,
      amount,
      type,
      currency,
      metadata: description ? { description } : undefined,
    })
  }
  private validate() :void{
    if (this.amount<=0){
      throw new DomainException('Transaction amount must be positive')
    }
  }
  markAsCompleted(): void {
    this.status = TransactionStatus.COMPLETED;
    this.updatedAt = new Date();
  }
  markAsFailed(reason?: string): void {
    this.status = TransactionStatus.FAILED;
    this.updatedAt = new Date();
    if (reason) {
      this.metadata = { ...this.metadata, failureReason: reason };
    }
  }

  isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === TransactionStatus.FAILED;
  }
}