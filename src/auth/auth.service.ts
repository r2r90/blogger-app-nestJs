import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto';
import { UserService } from '../user/user.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { add } from 'date-fns';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterUserDto) {
    const user = await this.usersService.findByLoginOrEmail(dto.email);
    if (user) throw new ConflictException('User already exists');
    const createdUser = await this.usersService.save(dto);

    if (!createdUser) return null;

    await this.mailService.sendRegistrationConfirmationCode(
      createdUser.email,
      createdUser.emailConfirmation.confirmationCode,
    );
    return createdUser;
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersService.findByLoginOrEmail(dto.loginOrEmail);
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
}
