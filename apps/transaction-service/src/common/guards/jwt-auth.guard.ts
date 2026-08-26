import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or missing JWT token');
    }
    return user;
  }
}