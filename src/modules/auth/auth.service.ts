import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfirmCodeDto, EmailValidationDto, LoginUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { add } from 'date-fns';
import { MailService } from '../mail/mail.service';
import { UserQueryRepository } from '../user/repositories/user.query.repository';
import { AuthRepository } from './repositories/auth.repository';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../user/repositories/user.repository';
import { UserService } from '../user/user.service';
import { AuthJwtTokenService } from './auth-jwt-token.service';
import { SecurityDevicesRepository } from '../security-devices/security-devices.repository';
import { TokenRepository } from './repositories/token.repository';
import { SessionData } from '../../db/db-mongo/schemas';
import { User } from '../user/entity/user.entity';
import { SecurityDevicesService } from '../security-devices/security-devices.service';
import { SessionInfoDto } from '../security-devices/dto /session-info.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly authJwtTokenService: AuthJwtTokenService,
    private readonly securityDevicesRepository: SecurityDevicesRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async confirmCode(confirmCodeDto: ConfirmCodeDto) {
    const { code } = confirmCodeDto;
    const user: User =
      await this.userQueryRepository.getUserByConfirmationCode(code);

    if (!user) {
      throw new BadRequestException(
        'Code Not Valid. Please check confirmation code!',
      );
    }
    if (user.is_confirmed === true)
      throw new BadRequestException([
        { message: 'User already confirmed', field: 'code' },
      ]);

    const isConfirmed = await this.userRepository.confirmUser(user.id);
    return !!isConfirmed;
  }

  async validateUser(dto: LoginUserDto) {
    const { loginOrEmail, password } = dto;

    const user =
      await this.userQueryRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      throw new BadRequestException('Invalid Login Or Password !');
    }

    const isMatch = await this.userService.compareHash(password, user.password);

    if (isMatch) return user;
    return null;
  }

  async login(
    sessionInfo: SessionInfoDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const createdSession =
      await this.securityDevicesService.saveSession(sessionInfo);

    const { accessToken, refreshToken } =
      await this.authJwtTokenService.generateTokenPair(
        sessionInfo.userId,
        createdSession.id,
      );

    await this.securityDevicesRepository.updateSession(
      createdSession.id,
      refreshToken,
    );

    return { accessToken, refreshToken };
  }

  async refreshToken(
    userId: string,
    sessionId: string,
    currentRefreshToken: string,
  ) {
    const user = await this.userQueryRepository.findUserById(userId);
    if (!user) {
      throw new InternalServerErrorException(
        'Something went wrong, please log in...',
      );
    }

    const isValidToken: boolean =
      await this.securityDevicesRepository.validateRefreshToken(
        sessionId,
        currentRefreshToken,
      );

    if (!isValidToken) {
      throw new UnauthorizedException('Token not valid to refresh');
    }

    const { accessToken, refreshToken } =
      await this.authJwtTokenService.generateTokenPair(userId, sessionId);

    await this.securityDevicesRepository.updateSession(sessionId, refreshToken);

    return { accessToken, refreshToken };
  }

  async logoutFromDevice(sessionId: string, currentRefreshToken: string) {
    const isValidToken: boolean =
      await this.securityDevicesRepository.validateRefreshToken(
        sessionId,
        currentRefreshToken,
      );

    if (!isValidToken) {
      throw new UnauthorizedException('Token not valid to logout');
    }

    return await this.securityDevicesRepository.logoutFromDevice(sessionId);
  }

  async sendRecoveryCode(email: string): Promise<boolean> {
    const user = await this.userQueryRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User with email does not exist');
    }

    const recoveryCode = uuidv4();
    const updateRecoveryCode = await this.userRepository.updateConfirmationCode(
      email,
      recoveryCode,
    );

    const sendCodeToUser = await this.mailService.sendRecoveryCodeToUser(
      email,
      recoveryCode,
    );

    if (!sendCodeToUser) {
      throw new BadRequestException('Cannot send recovery code');
    }

    return true;
  }

  async resendRecoveryCode(emailDto: EmailValidationDto) {
    const { email } = emailDto;
    const user = await this.userQueryRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException([
        { message: `Can't find user with email ${email}`, field: 'email' },
      ]);
    }

    if (user.is_confirmed === true) {
      throw new BadRequestException([
        { message: `User with ${email} is already confirmed'`, field: 'email' },
      ]);
    }
    const newConfirmationCode = uuidv4();
    await this.userService.updateEmailConfirmationCode(
      email,
      newConfirmationCode,
    );

    await this.mailService.sendRegistrationConfirmationCode(
      email,
      newConfirmationCode,
    );
    return true;
  }

  async updatePasswordWithRecoveryCode(password: string, code: string) {
    // const userWithRecoveryCode =
    //   await this.userQueryRepository.getUserByRecoveryCode(code);
    // if (!userWithRecoveryCode) {
    //   throw new NotFoundException('Recovery Code is invalid');
    // }
    //
    // const hashedPassword = await this.hashPassword(password);
    // const updatePassword = await this.userRepository.updatePassword(
    //   userWithRecoveryCode._id,
    //   hashedPassword,
    // );
    // if (!updatePassword) {
    //   throw new BadRequestException('Cannot updateBlog password');
    // }
    //
    // return updatePassword;
  }

  async checkRefreshCodeWithDevice(
    userId: string,
    deviceId: string,
  ): Promise<SessionData | null> {
    return this.securityDevicesRepository.isLoggedDevice(userId, deviceId);
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

  /*
   *  Ip restriction version
   */
}
