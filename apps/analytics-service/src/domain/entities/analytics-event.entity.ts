

export class AnalyticsEvent {

    readonly id!: string;
  transactionId!: string;
  reference!: string;
  fromWalletId!: string;
  toWalletId!: string;
  amount!: number;
  currency!: string;
  userId?: string;
  eventType!: string;
  createdAt!: Date;

  constructor(partial: Partial<AnalyticsEvent>){
    Object.assign(this, partial)
    this.createdAt= this.createdAt || new Date();
  }

}