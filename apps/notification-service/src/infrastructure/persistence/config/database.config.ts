import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';


export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5435,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: 'notification_db',
  entities: [NotificationOrmEntity],
  synchronize: true,
};