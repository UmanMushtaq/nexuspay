import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyticsEventOrmEntity } from "../persistence/entities/analytics-event.orm-entity";
import { Repository } from "typeorm";
import { AnalyticsEvent } from "../../domain/entities/analytics-event.entity";



@Injectable()
export class AnalyticsEventRepository{

    constructor(
        @InjectRepository(AnalyticsEventOrmEntity)
        private readonly repo:Repository<AnalyticsEventOrmEntity>
    ){}


    async save (event:AnalyticsEvent):Promise<AnalyticsEvent>{
            const saved = await this.repo.save({
      transactionId: event.transactionId,
      reference: event.reference,
      fromWalletId: event.fromWalletId,
      toWalletId: event.toWalletId,
      amount: event.amount,
      currency: event.currency,
      userId: event.userId,
      eventType: event.eventType,
    });

    return new AnalyticsEvent(saved);
    }
    async findAll(): Promise<AnalyticsEvent[]> {
    const results = await this.repo.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
    return results.map((r) => new AnalyticsEvent(r));
  }
}