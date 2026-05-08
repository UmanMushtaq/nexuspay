
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fromWalletId!: string;

  @Column()
  toWalletId!: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount!: number;

  @Column()
  currency!: string;

  @Column()
  type!: string;

  @Column()
  status!: string;

  @Column()
  reference!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}