export {};

declare global {
  namespace Express {
    interface Request {
      sessionData: {
        userId: string;
        ip: string;
        title: string;
        lastActiveDate: string;
      };
    }

    interface User {
      userId: string;
      deviceId: string;
      expiresAt: Date;
    }
  }
}
