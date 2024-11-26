import { Request } from 'express';

export const cookieConfig = {
  refreshToken: {
    name: 'refreshToken',
    options: {
      path: '/', // For production, use '/auth/api/refresh-tokens'. We use '/' for localhost in order to work on Chrome.
      httpOnly: true,
      sameSite: 'strict' as 'strict',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days; must match Refresh JWT expiration.
    },
  },
};
