import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decode } from 'jsonwebtoken';

export const CookieDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (
      request.headers.authorization &&
      request.headers.authorization.split(' ')[1]
    ) {
      const accessToken = request.headers.authorization.split(' ')[1];
      const decodedJWT = decode(accessToken);

      return data ? decodedJWT[data] : decodedJWT;
    }

    return {
      sub: null,
      login: null,
      iat: null,
      exp: null,
    };
  },
);
