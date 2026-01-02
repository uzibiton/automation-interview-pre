import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

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
    const firestoreId = (user as any).firestoreId;
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
      // Include Firestore document ID for API service queries
      userId: firestoreId || String(user.id),
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        // Include Firestore document ID
        firestoreId: firestoreId || String(user.id),
      },
    };
  }

  async validateToken(payload: any): Promise<any> {
    const user = await this.usersService.findById(payload.sub);
    if (user) {
      // Include userId from payload for API service to use
      (user as any).userId = payload.userId;
      // Also include firestoreId for frontend member matching
      (user as any).firestoreId = payload.userId;
    }
    return user;
  }

  async register(email: string, password: string, name?: string) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.usersService.createUser({
      email,
      name: name || email.split('@')[0],
      passwordHash,
    });

    return this.login(user);
  }

  async loginWithPassword(email: string, password: string) {
    // Find user with password
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Remove password from user object
    delete user.passwordHash;

    return this.login(user);
  }
}
