import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_CONNECTION } from './db.constants';
import { MongooseConfigService } from './mongoose.config.service';

const MONGO_DATABASE_PROVIDER = {
  provide: DB_CONNECTION,
  useFactory: async (
    config: ConfigService,
    mongooseConfigService: MongooseConfigService,
  ): Promise<Connection> => {
    const { uri } = await mongooseConfigService.createMongooseOptions();

    mongoose.connection.on('connecting', () => {
      console.log('MONGO-DB: CONNECTING TO DATABASE');
    });

    mongoose.connection.on('connected', () => {
      console.log('MONGO-DB: DATABASE SUCCESSFULLY CONNECTED');
    });

    mongoose.connection.on('error', (error) => {
      console.error('MONGO-DB: CONNECTION ERROR', error);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MONGO-DB: DATABASE RECONNECTED');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MONGO-DB: DATABASE DISCONNECTED');
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
  providers: [MONGO_DATABASE_PROVIDER, MongooseConfigService],
  exports: [MONGO_DATABASE_PROVIDER, MongooseModule],
})
export class DatabaseModule {}
