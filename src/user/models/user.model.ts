import { prop, modelOptions } from '@typegoose/typegoose';
import { IsString, IsNotEmpty } from 'class-validator';
import { hashSync } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { transform } from '@common/utils';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ApiResponseProperty } from '@nestjs/swagger';
import { ID } from '@common/types';

@modelOptions({
  schemaOptions: {
    versionKey: false,
    toJSON: { transform },
  },
})
export class User extends Base {

  @IsString()
  @IsNotEmpty()
  @ApiResponseProperty()
  @prop({ required: true, index: true, unique: true })
  public email: string;

  @Exclude()
  @IsString()
  @IsNotEmpty()
  @prop({ hideJSON: true, select: false })
  private passwordHash: string;

  set password(value) {
    this.passwordHash = hashSync(value, 12);
  }

  get password() {
    return this.passwordHash;
  }

}
