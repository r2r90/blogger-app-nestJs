import * as process from 'node:process';

export default () => ({
  port: process.env.APP_PORT || 3003,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  localEnv: process.env.NODE_ENV,
  localDb: process.env.MONGO_DB_URI_LOCAL,
  accessJwtSecret: process.env.ACCESS_JWT_SECRET,
  accessJwtExpiration: process.env.ACCESS_JWT_EXPIRES_IN,
  refreshJwtSecret: process.env.REFRESH_JWT_SECRET,
  refreshJwtExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN,

  //Nodemailer
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailUsername: process.env.EMAIL_USERNAME,
  emailPassword: process.env.EMAIL_PASSWORD,

  // mongoUri: process.env.MONGODB_DB_URI
});
