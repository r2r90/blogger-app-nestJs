import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../db/schemas/users.schema';
import { add } from 'date-fns';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../user.service';
import { Injectable } from '@nestjs/common';


export class CreateUserCommand {
  constructor(
    public readonly login: string,
    public readonly password: string,
    public readonly email: string,
  ) {}
}


@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  async execute(command: CreateUserCommand): Promise<Partial<User>> {
    const hashedPassword = await this.userService.hashPassword(
      command.password,
    );
    return this.usersRepository.create({
      ...command,
      password: hashedPassword,
      emailConfirmation: {
        confirmationCode: null,
        expirationDate: add(new Date(), { hours: 1 }),
        isConfirmed: true,
      },
      createdAt: null,
      recoveryCode: null,
    });
  }
}
