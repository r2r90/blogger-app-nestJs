import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
      passwordField: 'password',
    });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<{ userId: string }> {
    const user = await this.authService.validateUser({
      loginOrEmail,
      password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      userId: user.user_id,
    };
  }
}
