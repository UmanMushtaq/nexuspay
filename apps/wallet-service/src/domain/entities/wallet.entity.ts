


export class Wallet {
  readonly id!: string;
  userId!: string;
  balance!: number;
  currency!: string;
  isLocked!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor (partial: Partial<Wallet>){
    Object.assign(this, partial);
    this.balance = this.balance || 0;
    this.currency = this.currency || 'EUR';
    this.isLocked = this.isLocked || false;
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = new Date();
  }
  canSpend(amount: number): boolean {
    return !this.isLocked && this.balance >= amount;
  }

  addBalance(amount: number): void {
    this.balance += amount;
    this.updatedAt = new Date();
  }

  deductBalance(amount: number): void {
    if (!this.canSpend(amount)) {
      throw new Error('Insufficient balance or wallet is locked');
    }
    this.balance -= amount;
    this.updatedAt = new Date();
  }

}