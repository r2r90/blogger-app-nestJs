import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (
      !request.headers.authorization ||
      request.headers.authorization.trim() === ''
    ) {
      return true;
    }

    const accessToken = request.headers.authorization.split(' ')[1];

    const payload = this.jwtService.decode(accessToken);

    if (!payload) {
      return true;
    }
    const isUserExist = await this.userService.getUserById(payload.sub);
    if (!isUserExist) {
      return true;
    }

    request['user'] = { userId: payload.sub, deviceId: payload.deviceId };

    return true;
  }
}
