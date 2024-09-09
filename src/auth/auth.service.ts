import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfirmCodeDto, LoginUserDto, RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { add } from 'date-fns';
import { MailService } from '../mail/mail.service';
import { UserQueryRepository } from '../user/repositories/user.query.repository';
import { AuthRepository } from './repositories/auth.repository';
import { v4 as uuidv4 } from 'uuid';
import { AuthQueryRepository } from './repositories/auth.query.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly authRepository: AuthRepository,
    private readonly authQueryRepository: AuthQueryRepository,
  ) {}

  async register(dto: RegisterUserDto) {
    const user = await this.userQueryRepository.findByLoginOrEmail(dto.email);
    if (user) throw new ConflictException('User already exists');

    const hashedPassword = await this.hashPassword(dto.password);
    const randomConfirmationCode = uuidv4();

    const dataToCreateUser = {
      login: dto.login,
      email: dto.email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomConfirmationCode,
        expirationDate: add(new Date(), { hours: 1 }).toISOString(),
        isConfirmed: false,
      },
    };
    const createUser = await this.authRepository.create(dataToCreateUser);
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
      throw new BadRequestException('User already confirmed');
    const currentTime = new Date();
    const expirationDate = new Date(user.emailConfirmation.expirationDate);
    if (currentTime < expirationDate)
      throw new BadRequestException('Confirmation code expired');
    if (!user) return null;
    const isConfirmed = await this.authRepository.confirmUser(user._id);
    return !!isConfirmed;
  }

  async login(dto: LoginUserDto) {
    const user = await this.userQueryRepository.findByLoginOrEmail(
      dto.loginOrEmail,
    );
    if (!user || !compareSync(dto.password, user.password))
      throw new UnauthorizedException('Incorrect password or login');

    const accessToken = this.jwtService.sign({
      id: user._id,
      email: user.email,
    });
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
