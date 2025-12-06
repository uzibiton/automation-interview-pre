import { Controller, Get, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const loginData = await this.authService.login(req.user);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${loginData.access_token}`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  verifyToken(@Req() req) {
    return {
      valid: true,
      user: req.user,
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password, registerDto.name);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.loginWithPassword(loginDto.email, loginDto.password);
  }

  @Post('dev-login')
  async devLogin(@Body() body: { email: string; name?: string }) {
    // ⚠️ DEVELOPMENT ONLY - Remove in production
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Dev login disabled in production');
    }

    // Auto-register with dummy password if user doesn't exist
    try {
      return await this.authService.loginWithPassword(body.email, 'dev-password-123');
    } catch {
      // User doesn't exist, create them
      return await this.authService.register(
        body.email,
        'dev-password-123',
        body.name || 'Dev User',
      );
    }
  }
}
