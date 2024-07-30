export default () => ({
  port: process.env.PORT || 3003,
  mongoUri: process.env.MONGODB_DB_URI || 'mongodb://localhost:27017',
});
