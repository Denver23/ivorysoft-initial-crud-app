import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.model';
import { CreateUserDto } from './dto/create-new-user.dto';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  private logger: Logger;
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.logger = new Logger('UserService');
  }

  async findById(_id: string): Promise<UserDocument | null> {
    return this.userModel.findById(_id);
  }

  async findOne(filter: object): Promise<UserDocument | null> {
    return this.userModel.findOne(filter);
  }

  async create(data: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create({ ...data });
  }
}
