import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class NotificationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  type!: string;

  @Column()
  message!: string;

  @Column()
  channel!: string;

  @Column()
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}