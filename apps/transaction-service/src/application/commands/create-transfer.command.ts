


export class CreateTransferCommand{
    constructor(
        public readonly fromWalletId:string,
        public readonly toWalletId:string,
        public readonly amount:number,
        public readonly currency = 'USD',
        public readonly description?:string,
        public readonly userId?:string
    ){}

    validate():void{
        if(!this.fromWalletId || !this.toWalletId){
            throw new Error('Source and target wallet IDs are required');
    }
    if (this.amount <= 0) {
      throw new Error('Transfer amount must be greater than zero');
    }
    if (this.fromWalletId === this.toWalletId) {
      throw new Error('Cannot transfer to the same wallet');
    }
}
}