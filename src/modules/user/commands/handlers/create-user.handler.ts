import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { add } from 'date-fns';
import { UserRepository } from '../../repositories/user.repository';
import { UserService } from '../../user.service';
import { Injectable } from '@nestjs/common';
import { CreateUserCommand } from '../impl/create-user.command.';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../../../mail/mail.service';
import { UserOutputType } from '../../types';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserOutputType> {
    const hashedPassword = await this.userService.hashPassword(
      command.password,
    );

    const randomConfirmationCode = uuidv4();

    if (!command.isAdmin) {
      this.mailService.sendRegistrationConfirmationCode(
        command.email,
        randomConfirmationCode,
      );
    }

    return this.usersRepository.create({
      ...command,
      password: hashedPassword,
      emailConfirmation: {
        confirmationCode: command.isAdmin ? null : randomConfirmationCode,
        expirationDate: command.isAdmin ? null : add(new Date(), { hours: 1 }),
        isConfirmed: command.isAdmin,
      },
      createdAt: null,
      recoveryCode: null,
    });
  }
}
