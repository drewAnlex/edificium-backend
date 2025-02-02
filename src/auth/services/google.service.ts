import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validateGoogleToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Token inválido');

      // Buscar o registrar usuario en la base de datos
      let user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        user = await this.usersService.create({
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
          provider: 'google',
          phone: '',
          password: '',
          resetToken: '',
          resetTokenExpires: undefined,
          vinculationCode: '',
          vinculationCodeExpires: undefined,
        });
      }

      const userPayload = {
        sub: user.id,
        role: user.role.Name,
        building: user.building ? user.building : null,
        apartments: user.apartments ? user.apartments.map((a) => a.id) : null,
      };
      // Generar JWT interno
      return this.jwtService.sign(userPayload);
    } catch (error) {
      throw new UnauthorizedException('Google OAuth inválido');
    }
  }
}
