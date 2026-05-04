
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WalletOrmEntity } from '../entities/wallet.orm-entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'password',
  database: 'wallet_db',
  entities: [WalletOrmEntity],
  synchronize: true,        // temporary for development
  logging: true,
  autoLoadEntities: true,
};