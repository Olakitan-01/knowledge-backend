import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './user.service';
import { Request } from 'express';
import { User } from '../auth/schema/user.schema';
import { Document } from 'mongoose';
import { UpdateProfileDto } from './dto/profile.dto';

interface AuthRequest extends Request {
  user: User & Document & { _id: string };
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: AuthRequest) {
    const userId = (req.user._id as unknown as string).toString();
    return this.usersService.getMe(userId);
  }

  @Patch('/me')
  @UseGuards(AuthGuard('jwt'))
  updateMe(@Req() req: AuthRequest, @Body() updateData: UpdateProfileDto) {
    const userId = (req.user._id as unknown as string).toString();
    return this.usersService.updateMe(userId, updateData);
  }

  @Get('/me/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
