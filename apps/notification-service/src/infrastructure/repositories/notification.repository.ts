import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationOrmEntity } from '../persistence/entities/notification.orm-entity';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository.interface';

@Injectable()
export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly repo: Repository<NotificationOrmEntity>,
  ) {}

  async create(notification: Notification): Promise<Notification> {
    const entity = this.repo.create({
      userId: notification.userId,
      type: notification.type,
      message: notification.message,
      channel: notification.channel,
      status: notification.status,
    });
    const saved = await this.repo.save(entity);
    return new Notification(saved);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const saved = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return saved.map(s => new Notification(s));
  }
}