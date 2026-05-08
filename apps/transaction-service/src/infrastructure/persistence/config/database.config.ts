import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5434,                   
  username: 'postgres',
  password: 'password',
  database: 'transaction_db',
  entities: [TransactionOrmEntity],
  synchronize: true,            
  logging: true,
  autoLoadEntities: true,
};