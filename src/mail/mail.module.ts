import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './mailer.config.service';

@Module({
  providers: [MailService, MailerConfigService],
  controllers: [MailController],
  imports: [
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
  ],
})
export class MailModule {}
