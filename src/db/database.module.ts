import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_CONNECTION } from './db.constants';
import { MongooseConfigService } from './mongoose-config.service';

const DATABASE_PROVIDER = {
  provide: DB_CONNECTION,
  useFactory: async (
    config: ConfigService,
    mongooseConfigService: MongooseConfigService,
  ): Promise<Connection> => {
    const { uri } = await mongooseConfigService.createMongooseOptions();

    mongoose.connection.on('connecting', () => {
      console.log('CONNECTING TO DATABASE');
    });

    mongoose.connection.on('connected', () => {
      console.log('DATABASE SUCCESSFULLY CONNECTED ');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('DATABASE DISCONNECTED');
    });

    const mongooseConnection = await mongoose.connect(uri);

    return mongooseConnection.connection;
  },
  inject: [ConfigService, MongooseConfigService],
};

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
  ],
  providers: [DATABASE_PROVIDER, MongooseConfigService],
  exports: [DATABASE_PROVIDER, MongooseModule],
})
export class DatabaseModule {}
