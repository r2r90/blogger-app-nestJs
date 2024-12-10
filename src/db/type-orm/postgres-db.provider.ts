import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const PostgresDatabaseProvider = {
  provide: 'POSTGRES_DB_CONNECTION',
  useFactory: async (configService: ConfigService) => {
    console.log('Initializing PostgreSQL connection...');
    const dataSource = new DataSource({
      type: 'postgres', // Type de base de données
      host: configService.get('postgres_local_host'),
      port: configService.get('postgres_local_port'),
      username: configService.get('postgres_username'),
      password: configService.get('postgres_password'),
      database: configService.get('postgres_db_name'),
      entities: [],
      synchronize: process.env.DB_SYNC === 'true',
      logging: process.env.DB_LOGGING === 'true',
    });

    try {
      await dataSource.initialize();
      console.log('PostgreSQL Database Connected');
    } catch (error) {
      console.error('PostgreSQL Connection Error:', error);
      throw error;
    }

    console.log('hello');

    return dataSource;
  },
  inject: [ConfigService],
};
