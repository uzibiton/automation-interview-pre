import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
      const observable = this.httpService.get(`${authServiceUrl}/auth/verify`, {
        headers: { Authorization: authHeader },
      });
      const response: any = await firstValueFrom(observable as any);

      request.user = response.data.user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
