import { MONGO_DB_CONNECTION } from '../db.constants';
import { ConfigService } from '@nestjs/config';
import { MongooseConfigService } from './mongoose.config.service';
import mongoose, { Connection } from 'mongoose';

const MONGO_DATABASE_PROVIDER = {
  provide: MONGO_DB_CONNECTION,
  useFactory: async (
    config: ConfigService,
    mongooseConfigService: MongooseConfigService,
  ): Promise<Connection> => {
    const { uri } = mongooseConfigService.createMongooseOptions();

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
export default MONGO_DATABASE_PROVIDER;
