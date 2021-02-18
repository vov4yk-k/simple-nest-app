import { Controller, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from '@app/auth';
import { Body } from '@nestjs/common';
import { TokensDto, SigninDto, SignupDto } from '@app/auth/dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@app/user/models';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpStatus } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Auth } from '@common/decorators/auth.decorator';
import { CurrentUser } from '@common/decorators/user.decorator';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly authService: AuthService) {
  }

  @ApiTags('Auth')
  @Post('signup')
  @HttpCode(201)
  async signup(@Body() { email, password }: SignupDto): Promise<User> {
    return await this.authService.signup(email, password);
  }

  @ApiTags('Auth')
  @Post('signin')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @ApiResponse({ type: TokensDto, status: HttpStatus.OK })
  async signin(@Body() signin: SigninDto): Promise<TokensDto> {
    return this.authService.signin(signin);
  }

  @ApiTags('Profile')
  @Get('me')
  @Auth()
  @ApiResponse({ status: 200, type: User })
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

}
