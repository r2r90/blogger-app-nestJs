import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private config: ConfigService) {}

  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    const username = this.config.get('username');
    const password = this.config.get('password');
    const host = this.config.get('host');
    const port = this.config.get('port');
    const dbName = this.config.get('dbName');
    const isLocal = this.config.get('NODE_ENV') === 'LOCAL';
    const localDB = this.config.get('localDb');


    //const uri = `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority&appName=blog-app-nest`;
    const uri = `mongodb://localhost:27017/${dbName}`;
    return { uri };
  }
}
