import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private config: ConfigService) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.config.get('emailHost'),
        port: this.config.get('emailPort'),
        secure: true,
        auth: {
          user: this.config.get('emailUsername'),
          pass: this.config.get('emailPassword'),
        },
      },
      defaults: {
        from: '"nest-modules" <aghartur@bk.ru>',
      },
    };
  }
}
