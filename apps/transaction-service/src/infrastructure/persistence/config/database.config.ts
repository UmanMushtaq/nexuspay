import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
host: process.env.DB_HOST || 'localhost',
 port: Number(process.env.DB_PORT) || 5434,            
  username: 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: 'transaction_db',
  entities: [TransactionOrmEntity],
  synchronize: true,            
  logging: true,
  autoLoadEntities: true,
};