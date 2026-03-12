import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDto } from './dto/signin.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    const payload = {
      sub: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    return {
      message: 'Signup successful',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        initials: user.initials,
      },
    };
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const user = await this.usersService.validateCredentials(
      signInDto.email,
      signInDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    return {
      message: 'Sign in successful',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        initials: user.initials,
      },
    };
  }

  @Patch('about/:id')
  async updateAbout(@Param('id') id: string, @Body('about') about: string) {
    const updated = await this.usersService.update(id, { about });
    if (!updated) {
      return {
        message: 'User not found',
        about: null,
      };
    }
    return {
      message: 'About section updated',
      about: updated.about,
    };
  }
  @Get('profile/:id')
  async getUserProfile(@Param('id') id: string) {
    return this.usersService.getUserProfile(id);
  }
}
