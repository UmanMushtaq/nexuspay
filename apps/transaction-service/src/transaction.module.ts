
import { Module } from '@nestjs/common';


import { TransactionSaga } from './application/sagas/transaction.saga';
import { TransactionRepositoryImpl } from './infrastructure/repositories/transaction.repository';
import { TransactionOrmEntity } from './infrastructure/persistence/entities/transaction.orm-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './infrastructure/persistence/config/database.config';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig,
    }),
TypeOrmModule.forFeature([TransactionOrmEntity]),
  ],
  controllers: [],
  providers: [
    TransactionSaga,
    TransactionRepositoryImpl,
  ],
})
export class TransactionModule {}