import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

// Dedup record for incoming events. Written in the same transaction as the
// balance change so a redelivery cannot replay the money movement.
@Entity('processed_events')
@Unique(['eventId', 'consumer'])
export class ProcessedEventOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventId!: string;

  @Column()
  consumer!: string;

  @CreateDateColumn()
  processedAt!: Date;
}
