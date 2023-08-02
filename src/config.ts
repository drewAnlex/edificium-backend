import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
    },
    apiKey: process.env.API_KEY,
    misc: {
      welcomeMessage: process.env.WELCOME_MESSAGE,
    },
  };
});
