import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { User } from '@app/user/models';
import { UserService } from '@app/user';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from '@app/auth/dto';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService) {
  }

  public async signup(email: string, password: string): Promise<any> {
    return this.userService.create({ email, password } as User);
  }

  public async signin(credentials: SigninDto): Promise<any> {
    const user: User = await this.userService.findByUsername(credentials.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      accessToken: this.generateToken(user),
    };
  }

  public verifyPassword(password: string, user: User) {
    if (!compareSync(password.toString(), user.password)) {
      throw new UnauthorizedException();
    }
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user._id,
      username: user.email,
    });
  }

}
