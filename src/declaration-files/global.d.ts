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
      id: string;
      login: string;
      expiresAt: Date;
    }
  }
}
