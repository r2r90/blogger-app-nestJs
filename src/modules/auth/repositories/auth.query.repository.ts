import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class AuthQueryRepository {
  constructor(@InjectDataSource() protected readonly db: DataSource) {}

  async saveToken(refreshToken: string): Promise<any> {}
}
