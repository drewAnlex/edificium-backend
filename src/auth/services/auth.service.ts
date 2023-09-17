import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...rta } = user;
        return rta;
      }
    }
    return null;
  }

  generateJWT(user: User) {
    const payload = {
      sub: user.id,
      role: user.role.Name,
      building: user.building ? user.building.id : null,
      apartments: user.apartments ? user.apartments.map((a) => a.id) : null,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
