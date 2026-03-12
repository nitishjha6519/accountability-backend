import {
  Injectable,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { GoalsService } from '../goals/goals.service';
import { ApplicationsService } from '../applications/applications.service';
import { FeedbackService } from '../feedback/feedback.service';
import { PasswordService } from '../common/services/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private passwordService: PasswordService,
    @Inject(forwardRef(() => GoalsService)) private goalsService: GoalsService,
    private applicationsService: ApplicationsService,
    private feedbackService: FeedbackService,
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
    const initials =
      createUserDto.initials || this.generateInitials(createUserDto.fullName);

    const userData = {
      ...createUserDto,
      passwordHash: hashedPassword,
      initials,
      rewardPoints: 200, // Give 200 points on signup
    };

    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .exec();

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

  async deductPoints(userId: string, amount: number): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    if (!user || user.rewardPoints < amount) {
      return false;
    }
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { rewardPoints: -amount },
    });
    console.log(
      `[Points] Deducted ${amount} points from user ${userId}. New balance: ${user.rewardPoints - amount}`,
    );
    return true;
  }

  async addPoints(userId: string, amount: number): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { rewardPoints: amount },
    });
    console.log(`[Points] Added ${amount} points to user ${userId}`);
  }

  async getPoints(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId).exec();
    return user?.rewardPoints || 0;
  }

  async update(userId: string, update: Partial<UpdateUserDto>) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, update, { new: true })
      .exec();
    return updatedUser;
  }
  async getUserProfile(id: string) {
    // Fetch user details
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return { message: 'User not found' };
    }

    // // Past goals
    // let pastGoals: any[] = [];
    // if (this.goalsService && this.goalsService.findByClientId) {
    //   pastGoals = await this.goalsService.findByClientId(id);
    // }

    // // Accepted applications
    // let acceptedApplications = [];
    // if (this.applicationsService && this.applicationsService.findByAssistantId) {
    //   acceptedApplications = await this.applicationsService
    //     .findByAssistantId(id)
    //     .then((apps: any[]) => apps.filter((app: any) => app.status === 'accepted'));
    // }

    // Reviews as assistant
    let reviews: any[] = [];
    if (this.feedbackService && this.feedbackService.findByReceivedBy) {
      reviews = await this.feedbackService.findByReceivedBy(id);
    }

    return {
      user,
      // pastGoals,
      // acceptedApplications,
      reviews,
    };
  }
}
