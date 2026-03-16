import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
import { User } from '../auth/schema/user.schema';
import { Document } from 'mongoose';

interface AuthRequest extends Request {
  user: User & Document & { _id: string };
}

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // Public — get all posts
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // Public — get single post
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  // Public — get posts by user
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.postsService.findByUser(userId);
  }

  // Protected — create post
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPostDto: CreatePostDto, @Req() req: AuthRequest) {
    // const userId = (req.user._id as unknown as string).toString();
    return this.postsService.create(createPostDto, req.user);
  }

  // Protected — update post
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: AuthRequest,
  ) {
    const userId = (req.user._id as unknown as string).toString();
    return this.postsService.update(id, updatePostDto, userId);
  }

  // Protected — delete post
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = (req.user._id as unknown as string).toString();
    return this.postsService.remove(id, userId);
  }
}
