import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile: any): Promise<User> {
    const { id, emails, displayName, photos } = profile;

    let user = await this.usersService.findByGoogleId(id);

    if (!user) {
      // Create new user if doesn't exist
      user = await this.usersService.createUser({
        googleId: id,
        email: emails[0].value,
        name: displayName,
        avatarUrl: photos[0]?.value,
      });
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async validateToken(payload: any): Promise<User> {
    return this.usersService.findById(payload.sub);
  }
}
