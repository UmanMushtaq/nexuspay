import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../persistence/entities/transaction.orm-entity';
import { TransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { TransactionStatus } from '../../domain/entities/transaction-status.enum';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {

  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly transactionRepo: Repository<TransactionOrmEntity>,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const ormEntity = this.transactionRepo.create({
      fromWalletId: transaction.fromWalletId,
      toWalletId: transaction.toWalletId,
      amount: transaction.amount,
      currency: transaction.currency,
      type: transaction.type,
      status: transaction.status,
      reference: transaction.reference,
    });

    const saved = await this.transactionRepo.save(ormEntity);

    return new Transaction({
      id: saved.id,
      fromWalletId: saved.fromWalletId,
      toWalletId: saved.toWalletId,
      amount: saved.amount,
      currency: saved.currency,
      type: saved.type as any,
      status: saved.status as any,
      reference: saved.reference,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    const saved = await this.transactionRepo.findOne({ where: { id } });
    if (!saved) return null;

    return new Transaction({
      id: saved.id,
      fromWalletId: saved.fromWalletId,
      toWalletId: saved.toWalletId,
      amount: saved.amount,
      currency: saved.currency,
      type: saved.type as any,
      status: saved.status as any,
      reference: saved.reference,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async updateStatus(transactionId: string, status: TransactionStatus): Promise<void> {
    await this.transactionRepo.update(
    { id: transactionId },
    { 
      status,
      updatedAt: new Date()
    }
  );
  }
}