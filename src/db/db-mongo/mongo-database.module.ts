import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose.config.service';
import forFeatureDb from './for-feature.db';
import MONGO_DATABASE_PROVIDER from './mongo-db.provider';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MongooseModule.forFeature(forFeatureDb),
  ],
  exports: [],
  providers: [MONGO_DATABASE_PROVIDER, MongooseConfigService],
})
export class MongoDatabaseModule {}
