import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      url: process.env.DATABASE_URL,
    },
    apiKey: process.env.API_KEY,
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    misc: {
      welcomeMessage: process.env.WELCOME_MESSAGE,
    },
  };
});
