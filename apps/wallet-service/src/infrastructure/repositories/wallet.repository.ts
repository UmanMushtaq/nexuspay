import { Injectable } from "@nestjs/common";
import { WalletRepository } from "../../domain/repositories/wallet.repository.interface";
import { InjectRepository } from '@nestjs/typeorm';
import { WalletOrmEntity } from "../persistence/entities/wallet.orm-entity";
import { Repository } from "typeorm";
import { Wallet } from "../../domain/entities/wallet.entity";

@Injectable()
export class WalletRepositoryImpl implements WalletRepository{

    constructor(
        @InjectRepository(WalletOrmEntity)
        private readonly walletRepo:Repository<WalletOrmEntity>,
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

    wallet.addBalance(amount);
    await this.walletRepo.update(userId, { balance: wallet.balance });

    return wallet;
  }

  async lockWallet(userId: string): Promise<void> {
    await this.walletRepo.update({ userId }, { isLocked: true });
  }

  async unlockWallet(userId: string): Promise<void> {
    await this.walletRepo.update({ userId }, { isLocked: false });
  }
}