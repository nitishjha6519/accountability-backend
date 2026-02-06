import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { PasswordService } from '../common/services/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email.toLowerCase(),
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    // Hash the password before saving
    const hashedPassword = await this.passwordService.hashPassword(
      createUserDto.password,
    );

    // Generate initials if not provided
    const initials = createUserDto.initials || this.generateInitials(createUserDto.fullName);

    const userData = {
      ...createUserDto,
      passwordHash: hashedPassword,
      initials,
    //   password: createUserDto.password, // Remove plaintext password
    };

    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findAll() {
    return this.userModel.find().select('-passwordHash').exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('-passwordHash').exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-passwordHash').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateData: any = { ...updateUserDto };

    // Hash password if provided
    if (updateUserDto.password) {
      updateData.passwordHash = await this.passwordService.hashPassword(
        updateUserDto.password,
      );
      delete updateData.password;
    }

    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-passwordHash')
      .exec();
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.passwordService.comparePasswords(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  private generateInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }
}
