// Обязательна регистрация в ioc
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserQueryRepository } from '../../../modules/user/repositories/user.query.repository';

@ValidatorConstraint({ name: 'NameIsExist', async: false })
@Injectable()
export class NameIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersQueryRepository: UserQueryRepository) {}
  async validate(value: any, args: ValidationArguments) {
    const nameIsExist = await this.usersQueryRepository.findByLoginOrEmail(value);
    return !nameIsExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'User already exist';
  }
}

export function NameIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: NameIsExistConstraint,
    });
  };
}