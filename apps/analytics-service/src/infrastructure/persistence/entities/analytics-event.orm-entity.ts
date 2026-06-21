import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('analytics_events')
export class AnalyticsEventOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  transactionId!: string;

  @Column()
  reference!: string;

  @Column()
  fromWalletId!: string;

  @Column()
  toWalletId!: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount!: number;

  @Column()
  currency!: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  eventType!: string;

  @CreateDateColumn()
  createdAt!: Date;
}