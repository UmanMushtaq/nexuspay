
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('wallets')
export class WalletOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  balance!: number;

  @Column({ default: 'EUR' })
  currency!: string;

  @Column({ default: false })
  isLocked!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}