
import { Module } from '@nestjs/common';


import { TransactionSaga } from './application/sagas/transaction.saga';
import { TransactionRepositoryImpl } from './infrastructure/repositories/transaction.repository';


@Module({
  imports: [

  ],
  controllers: [],
  providers: [
    TransactionSaga,
    TransactionRepositoryImpl,
  ],
})
export class TransactionModule {}