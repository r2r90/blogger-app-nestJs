import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostgresDatabaseProvider } from './postgres-db.provider';
import { TypeOrmConfigService } from './type-orm.config.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [PostgresDatabaseProvider, TypeOrmConfigService],
  exports: [TypeOrmModule, PostgresDatabaseProvider],
})
export class PostgresDatabaseModule {}
