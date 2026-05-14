export class TransactionInitiatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly reference: string,
    public readonly fromWalletId: string,
    public readonly toWalletId: string,
    public readonly amount: number,
    public readonly currency: string = 'USD',
    public readonly userId?: string,
    public readonly timestamp?: string,
  ) {}
}