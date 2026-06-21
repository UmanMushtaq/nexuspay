import { Controller, Get } from '@nestjs/common';
import { AnalyticsEventRepository } from '../repositories/analytics-event.repository';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsEventRepository: AnalyticsEventRepository) {}

  @Get('events')
  async getEvents() {
    return this.analyticsEventRepository.findAll();
  }
}