import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }
  findByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser: User | null = await this.userModel.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }
  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return { message: "Something happend, we couldn't delete this user" };
    }
    return { message: 'User deleted succcessfully' };
  }
}
