
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WalletOrmEntity } from '../entities/wallet.orm-entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
 host: process.env.DB_HOST || 'localhost',
 port: Number(process.env.DB_PORT) || 5433,
  username: 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: 'wallet_db',
  entities: [WalletOrmEntity],
  synchronize: true,        // temporary for development
  logging: true,
  autoLoadEntities: true,
};