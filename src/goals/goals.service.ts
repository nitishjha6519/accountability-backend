import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Goal, GoalDocument } from './schemas/goal.schema';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(@InjectModel(Goal.name) private goalModel: Model<GoalDocument>) {}

  async create(createGoalDto: CreateGoalDto) {
    const createdGoal = new this.goalModel(createGoalDto);
    return createdGoal.save();
  }

  async findAll() {
    return this.goalModel.find().exec();
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
