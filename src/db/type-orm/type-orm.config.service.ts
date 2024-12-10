import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres', // Type de base de données
      host: this.configService.get('postgres_local_host'),
      port: this.configService.get('postgres_local_port'),
      username: this.configService.get('postgres_username'),
      password: this.configService.get('postgres_password'),
      database: this.configService.get('postgres_db_name'),
      entities: [],
      synchronize: process.env.DB_SYNC === 'true',
      logging: process.env.DB_LOGGING === 'true',
    };
  }
}
