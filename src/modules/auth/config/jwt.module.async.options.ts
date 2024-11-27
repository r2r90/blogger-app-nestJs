import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import configuration from '../../../config/configuration';

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
  secret: configuration().accessJwtSecret,
  signOptions: {
    expiresIn: configuration().accessJwtExpiration,
  },
});

export const options = (): JwtModuleAsyncOptions => ({
  inject: [],
  useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
