import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { User } from './models';
import { ID } from '@common/types';
import { ConflictException, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {
  }

  public async create(user: User): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ email: user.email });

    if (existingUser) {
      throw new ConflictException('USER_ALREADY_EXIST');
    }

    return this.userModel.create(user);
  }

  public async findById(id: ID): Promise<User | undefined> {
    return this.userModel.findById(id).orFail(() => new NotFoundException(`User ${id} not found!`));
  }

  public async findByUsername(
    username: string,
  ): Promise<DocumentType<User>> {
    return this.userModel
      .findOne({ email: username })
      .select('+passwordHash');
  }
}
