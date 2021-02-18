import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from '@common/strategies';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@config';
import { Module } from '@nestjs/common';
import { UserModule } from '@app/user';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    //PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get('ACCESS_TOKEN_LIVE') },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [
    AuthService,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
