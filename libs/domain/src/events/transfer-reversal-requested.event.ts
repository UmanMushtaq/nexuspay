export class TransferReversalRequestedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly reference: string,
    public readonly fromWalletId: string,
    public readonly amount: number,
    public readonly reason: string,
  ) {}
}
