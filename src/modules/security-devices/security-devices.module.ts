import { Module } from '@nestjs/common';
import { SecurityDevicesController } from './security-devices.controller';
import { SecurityDevicesService } from './security-devices.service';
import { SecurityDevicesRepository } from './security-devices.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entity/session.entity';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [SecurityDevicesController],
  providers: [SecurityDevicesService, SecurityDevicesRepository],
  imports: [TypeOrmModule.forFeature([Session]), UserModule],
  exports: [SecurityDevicesService, SecurityDevicesRepository],
})
export class SecurityDevicesModule {}
