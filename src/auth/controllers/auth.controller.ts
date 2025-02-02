import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/User.entity';
import { GoogleAuthService } from '../services/google.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.generateJWT(user);
  }

  @Post('google')
  async googleLogin(@Body('idToken') idToken: string) {
    const jwt = await this.googleAuthService.validateGoogleToken(idToken);
    return { jwt };
  }
}
