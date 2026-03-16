import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './schema/user.schema';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ id: string; message: string }> {
    const { firstName, lastName, username, email, password, confirmPassword } =
      signUpDto;
    if (password !== confirmPassword) {
      throw new Error('Passwords not match');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPassword,
    });

    // const token = this.jwtService.sign({ id: user._id });
    return {
      id: user._id.toString(),
      message: 'User registered successfully',
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ token: string; id: string; message: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      id: user._id.toString(),
      message: 'string',
    });
    return {
      token,
      id: user._id.toString(),
      message: 'User logged in successfully',
    };
  }
}
