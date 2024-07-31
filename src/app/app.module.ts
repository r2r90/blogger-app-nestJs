import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from '../blog/blog.module';
import configs from '../config/configuration';
import configuration from '../config/configuration';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

