import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Expose()
export class TokensDto {
  @ApiResponseProperty()
  public accessToken: string;
}
