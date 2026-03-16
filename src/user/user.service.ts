import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schema/user.schema';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  // Get current logged in user
  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('-password'); // never return password
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Get any user by ID (public profile)
  async getUserById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Update current user profile
  async updateMe(userId: string, updateData: UpdateProfileDto) {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { ...updateData },
        { new: true }, // return updated document
      )
      .select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
