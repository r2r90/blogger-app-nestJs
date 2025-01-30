import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return next(); // No token, proceed to next middleware
    }

    const token = authHeader.split(' ')[1]; // Extract token from Bearer token

    if (!token) {
      return next(); // No token, proceed
    }

    try {
      const decoded = this.jwtService.decode(token);
      req['user'] = {
        userId: decoded.sub,
        sessionId: decoded.deviceId,
        expiresAt: decoded.exp,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return next();
  }
}
