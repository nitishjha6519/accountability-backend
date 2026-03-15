import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Goal, GoalDocument } from './schemas/goal.schema';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name) private goalModel: Model<GoalDocument>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  async create(createGoalDto: CreateGoalDto) {
    // Default rewardAmount is 50 if not provided
    const rewardAmount = createGoalDto.rewardAmount || 50;

    // Deduct points from client
    const deducted = await this.usersService.deductPoints(
      createGoalDto.clientId,
      rewardAmount,
    );

    if (!deducted) {
      throw new BadRequestException(
        `Insufficient points. Need ${rewardAmount} points to post this goal.`,
      );
    }

    const goalData = {
      ...createGoalDto,
      rewardAmount,
    };

    const createdGoal = new this.goalModel(goalData);
    console.log(
      `[Goal] Created goal. Deducted ${rewardAmount} points from client ${createGoalDto.clientId}`,
    );
    return createdGoal.save();
  }

  async findAll() {
    return this.goalModel
      .find({ status: { $ne: 'posted' } })
      .populate({ path: 'clientId', model: 'User' })
      .exec();
  }

  async findPostedForAdminReview() {
    return this.goalModel
      .find({ status: 'posted' })
      .populate({ path: 'clientId', model: 'User' })
      .sort({ createdAt: -1 })
      .exec();
  }

  async reviewGoal(
    id: string,
    adminId: string,
    action: 'approved' | 'rejected',
    comment?: string,
  ) {
    const goal = await this.goalModel.findById(id).exec();

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.status !== 'posted') {
      throw new BadRequestException('Only posted goals can be reviewed');
    }

    const updateData: {
      status: string;
      reviewedBy: string;
      reviewedAt: Date;
      adminComment?: string;
    } = {
      status: action === 'approved' ? 'approved' : 'draft',
      reviewedBy: adminId,
      reviewedAt: new Date(),
    };

    if (comment) {
      updateData.adminComment = comment;
    }

    return this.goalModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate({ path: 'clientId', model: 'User' })
      .populate({ path: 'reviewedBy', model: 'User' })
      .exec();
  }

  async findByClientId(clientId: string) {
    return this.goalModel.find({ clientId }).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string) {
    return this.goalModel.findById(id).exec();
  }

  async findByStatus(status: string) {
    return this.goalModel.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, updateGoalDto: UpdateGoalDto) {
    return this.goalModel
      .findByIdAndUpdate(id, updateGoalDto, { new: true })
      .exec();
  }

  async delete(id: string) {
    return this.goalModel.findByIdAndDelete(id).exec();
  }

  async findByCategory(category: string) {
    return this.goalModel.find({ category }).sort({ createdAt: -1 }).exec();
  }

  async findByTags(tags: string[]) {
    return this.goalModel
      .find({ tags: { $in: tags } })
      .sort({ createdAt: -1 })
      .exec();
  }
}
