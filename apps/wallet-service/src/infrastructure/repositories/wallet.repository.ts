import { Injectable } from "@nestjs/common";
import {
    WalletRepository,
    TransferRequest,
    TransferOutcome,
    RefundRequest,
} from "../../domain/repositories/wallet.repository.interface";
import { InjectRepository } from '@nestjs/typeorm';
import { WalletOrmEntity } from "../persistence/entities/wallet.orm-entity";
import { DataSource, EntityManager, Repository } from "typeorm";
import { Wallet } from "../../domain/entities/wallet.entity";

// Thrown to abort the transaction so the dedup row rolls back with it.
class Rejected extends Error {
  constructor(public readonly outcome: string) {
    super(outcome);
  }
}

@Injectable()
export class WalletRepositoryImpl implements WalletRepository{

    constructor(
        @InjectRepository(WalletOrmEntity)
        private readonly walletRepo:Repository<WalletOrmEntity>,
        private readonly dataSource: DataSource,
    ){}

    async create(wallet: Wallet): Promise<Wallet> {
        const walletOrmEntity = this.walletRepo.create({
            userId: wallet.userId,
      balance: wallet.balance,
      currency: wallet.currency,
      isLocked: wallet.isLocked,
        });
        const savedWallet = await this.walletRepo.save(walletOrmEntity);
        return new Wallet({
      id: savedWallet.id,
      userId: savedWallet.userId,
      balance: savedWallet.balance,
      currency: savedWallet.currency,
      isLocked: savedWallet.isLocked,
      createdAt: savedWallet.createdAt,
      updatedAt: savedWallet.updatedAt,
    });
    }
    async findByUserId(userId: string): Promise<Wallet | null> {
    const saved = await this.walletRepo.findOne({ where: { userId } });
    if (!saved) return null;

    return new Wallet(saved);
  }

   async updateBalance(userId: string, amount: number): Promise<Wallet> {
    const wallet = await this.findByUserId(userId);
    if (!wallet) throw new Error('Wallet not found');
    wallet.addBalance(Number(amount));
    wallet.balance = Number(wallet.balance) + Number(amount);
    await this.walletRepo.update({ userId }, { balance: wallet.balance });
    return wallet;
  }

  async lockWallet(userId: string): Promise<void> {
    await this.walletRepo.update({ userId }, { isLocked: true });
  }

  async unlockWallet(userId: string): Promise<void> {
    await this.walletRepo.update({ userId }, { isLocked: false });
  }
    async deductBalance(userId: string, amount: number): Promise<Wallet> {
    const wallet = await this.findByUserId(userId);
    if (!wallet) throw new Error('Wallet not found');
    wallet.deductBalance(amount);
    await this.walletRepo.update({ userId }, { balance: wallet.balance });
    return wallet;
  }
   async findById(id: string): Promise<Wallet | null> {
    const saved = await this.walletRepo.findOne({ where: { id } });
    if (!saved) return null;
    return new Wallet(saved);
  }

  // Moves money between two wallets in a single database transaction.
  // Both legs commit together or neither does, so there is no window where
  // the sender is debited without the receiver being credited.
  async transfer(request: TransferRequest): Promise<TransferOutcome> {
    const { transactionId, fromWalletId, toWalletId, amount } = request;

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Transfer amount must be a positive number');
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        const fresh = await this.markProcessed(manager, transactionId, 'wallet.transfer');
        if (!fresh) return 'DUPLICATE';

        // Check the receiver before touching the sender's balance.
        const receiver = await manager.query(
          `SELECT id FROM wallets WHERE id = $1`,
          [toWalletId],
        );
        if (receiver.length === 0) throw new Rejected('RECEIVER_NOT_FOUND');

        const sender = await manager.query(
          `SELECT id FROM wallets WHERE id = $1`,
          [fromWalletId],
        );
        if (sender.length === 0) throw new Rejected('SENDER_NOT_FOUND');

        // The balance check and the decrement are one statement, so two
        // concurrent transfers cannot both pass the check.
        const debited = await manager.query(
          `UPDATE wallets
              SET balance = balance - $1, "updatedAt" = now()
            WHERE id = $2 AND "isLocked" = false AND balance >= $1
          RETURNING id`,
          [amount, fromWalletId],
        );
        if (debited.length === 0) throw new Rejected('INSUFFICIENT_FUNDS');

        await manager.query(
          `UPDATE wallets
              SET balance = balance + $1, "updatedAt" = now()
            WHERE id = $2`,
          [amount, toWalletId],
        );

        return 'OK';
      });
    } catch (error) {
      // A rejection rolls the dedup row back with it, so a redelivery can
      // still retry. Only a settled transfer stays marked as processed.
      if (error instanceof Rejected) return error.outcome as TransferOutcome;
      throw error;
    }
  }

  // Compensating action for a transfer that has to be undone downstream.
  async refund(request: RefundRequest): Promise<'OK' | 'DUPLICATE' | 'WALLET_NOT_FOUND'> {
    const { transactionId, walletId, amount } = request;

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Refund amount must be a positive number');
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        const fresh = await this.markProcessed(manager, transactionId, 'wallet.refund');
        if (!fresh) return 'DUPLICATE';

        const credited = await manager.query(
          `UPDATE wallets
              SET balance = balance + $1, "updatedAt" = now()
            WHERE id = $2
          RETURNING id`,
          [amount, walletId],
        );
        if (credited.length === 0) throw new Rejected('WALLET_NOT_FOUND');

        return 'OK';
      });
    } catch (error) {
      if (error instanceof Rejected) return 'WALLET_NOT_FOUND';
      throw error;
    }
  }

  // Returns false when this event was already handled by this consumer.
  private async markProcessed(
    manager: EntityManager,
    eventId: string,
    consumer: string,
  ): Promise<boolean> {
    const inserted = await manager.query(
      `INSERT INTO processed_events ("eventId", consumer)
       VALUES ($1, $2)
       ON CONFLICT ("eventId", consumer) DO NOTHING
       RETURNING id`,
      [eventId, consumer],
    );
    return inserted.length > 0;
  }
}
