export class WalletDebitFailedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly reference: string,
    public readonly fromWalletId: string,
    public readonly reason: string,
  ) {}
}