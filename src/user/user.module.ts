import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../auth/schema/user.schema';
import { UserSchema } from '../auth/schema/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule, // ← import AuthModule so JWT guard works
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
