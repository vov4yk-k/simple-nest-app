import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@app/user';
import { AuthService } from '@app/auth/auth.service';
import { User } from '@app/user/models';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async validateUser(username: string, password: string): Promise<User> {

    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    this.authService.verifyPassword(password, user);

    return user;
  }
}
