import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import config from '../config';
import { ConfigType } from '@nestjs/config';
import { GoogleAuthService } from './services/google.service';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => ({
        secret: configService.jwt.secret,
        signOptions: {
          expiresIn: configService.jwt.expiresIn,
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleAuthService],
  controllers: [AuthController],
})
export class AuthModule {}
