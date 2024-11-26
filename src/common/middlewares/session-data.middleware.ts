import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class SessionDataMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract IP address
    const ip = req.ip || req.headers['x-forwarded-for'][0];

    // Extract and parse User-Agent
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const title = parser.getBrowser().name;

    req.sessionData = {
      userId: null,
      ip,
      title,
      lastActiveDate: new Date().toDateString(),
    };

    next();
  }
}
