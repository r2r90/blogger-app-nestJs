import * as process from 'node:process';

export default () => ({
  port: process.env.APP_PORT || 3003,

  // MONGO DB CONSTANTS
  mongo_username: process.env.MONGO_DB_USERNAME,
  mongo_password: process.env.MONGO_DB_PASSWORD,
  mongo_host: process.env.DB_HOST,
  mongo_local_port: process.env.LOCAL_MONGO_DB_PORT,
  mongo_local_host: process.env.MONGO_LOCAL_DB_HOST,
  mongo_db_name: process.env.MONGO_DB_NAME,
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
