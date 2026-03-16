import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
  ) {}

  // Get all posts
  async findAll(page: number = 1, limit: number = 15) {
    const skip = (page - 1) * limit;

    const posts = await this.postModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.postModel.countDocuments();
    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    };
  }

  // Get single post
  async findOne(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  // Get posts by user
  async findByUser(userId: string) {
    return this.postModel.find({ userId }).sort({ createdAt: -1 });
  }

  // Create post
  async create(createPostDto: CreatePostDto, user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userData = user._doc || user;
    const post = await this.postModel.create({
      ...createPostDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      userId: userData._id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      username: userData.username,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      avatar: user.avatar || undefined,
    });
    return post;
  }

  // Update post
  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId.toString() !== userId) {
      throw new UnauthorizedException('You can only edit your own posts');
    }
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
  }

  // Delete post
  async remove(id: string, userId: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId.toString() !== userId) {
      throw new UnauthorizedException('You can only delete your own posts');
    }
    await this.postModel.findByIdAndDelete(id);
    return { message: 'Post deleted successfully' };
  }
}
