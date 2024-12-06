import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private config: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const username = this.config.get('mongo_username');
    const password = this.config.get('mongo_password');
    const dbName = this.config.get('mongo_db_name');
    const localHost = this.config.get('mongo_local_host');
    const localPort = this.config.get('mongo_local_port');
    const isLocal = this.config.get('NODE_ENV') === 'LOCAL';

    let uri: string;

    if (isLocal) {
      uri = `mongodb://${username}:${password}@${localHost}:${localPort}/${dbName}?authSource=admin`;
    } else {
      const host = this.config.get('mongo_host');
      uri = `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority&authSource=admin`;
    }

    return { uri };
  }
}
