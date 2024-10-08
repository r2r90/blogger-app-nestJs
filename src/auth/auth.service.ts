import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ConfirmCodeDto,
  EmailValidationDto,
  LoginUserDto,
  RegisterUserDto,
} from './dto';
import * as bcrypt from 'bcrypt';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { add } from 'date-fns';
import { MailService } from '../mail/mail.service';
import { UserQueryRepository } from '../user/repositories/user.query.repository';
import { AuthRepository } from './repositories/auth.repository';
import { v4 as uuidv4 } from 'uuid';
import { AuthQueryRepository } from './repositories/auth.query.repository';
import { UserRepository } from '../user/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly authQueryRepository: AuthQueryRepository,
  ) {}

  async register(dto: RegisterUserDto) {
    const hashedPassword = await this.hashPassword(dto.password);
    const randomConfirmationCode = uuidv4();

    const dataToCreateUser = {
      login: dto.login,
      email: dto.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomConfirmationCode,
        expirationDate: add(new Date(), { hours: 1 }),
        isConfirmed: false,
      },
      recoveryCode: null,
    };
    const createUser = await this.userRepository.create(dataToCreateUser);
    if (!createUser) return null;
    await this.mailService.sendRegistrationConfirmationCode(
      dto.email,
      randomConfirmationCode,
    );
    return true;
  }

  async confirmCode(confirmCodeDto: ConfirmCodeDto) {
    const { code } = confirmCodeDto;
    const user = await this.authQueryRepository.getUserByConfirmationCode(code);
    if (user.emailConfirmation?.isConfirmed === true)
      throw new BadRequestException([
        { message: 'User already confirmed', field: 'code' },
      ]);
    if (!user) return null;
    const isConfirmed = await this.authRepository.confirmUser(user._id);
    return !!isConfirmed;
  }

  async validateUser(dto: LoginUserDto) {
    const user = await this.userQueryRepository.findByLoginOrEmail(
      dto.loginOrEmail,
    );
    if (!user || !compareSync(dto.password, user.password))
      throw new UnauthorizedException('Incorrect password or login');

    return {
      userId: user._id,
      login: user.login,
    };
  }

  async signIn(user: { userId: string; login: string }) {
    const tokenPayload = {
      sub: user.userId,
      login: user.login,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);
    return { accessToken };
  }

  async resendValidationEmail(emailDto: EmailValidationDto) {
    const { email } = emailDto;
    const user = await this.userQueryRepository.findByLoginOrEmail(email);
    if (!user) {
      throw new BadRequestException([
        { message: `Can't find user with email ${email}`, field: 'email' },
      ]);
    }
    if (user.emailConfirmation.isConfirmed === true) {
      throw new BadRequestException([
        { message: `User with ${email} is already confirmed'`, field: 'email' },
      ]);
    }

    const newConfirmationCode = uuidv4();

    await this.authRepository.updateConfirmationCode(
      user._id,
      newConfirmationCode,
    );

    await this.mailService.sendRegistrationConfirmationCode(
      email,
      newConfirmationCode,
    );
    return true;
  }

  private async getRefreshToken(userId: string): Promise<string> {
    return this.jwtService.sign({
      id: userId,
      exp: add(new Date(), { minutes: 5 }),
    });
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
