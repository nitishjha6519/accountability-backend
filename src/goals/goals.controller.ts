import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ReviewGoalDto } from './dto/review-goal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('admin/posted')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findPostedForAdminReview() {
    return this.goalsService.findPostedForAdminReview();
  }

  @Patch('admin/:id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  reviewGoal(
    @Param('id') id: string,
    @Body() reviewGoalDto: ReviewGoalDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.goalsService.reviewGoal(
      id,
      req.user.sub,
      reviewGoalDto.action,
      reviewGoalDto.comment,
    );
  }

  @Post('create')
  create(@Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(createGoalDto);
  }

  @Get('all')
  findAll() {
    return this.goalsService.findAll();
  }

  @Get('goalsid/:id')
  findById(@Param('id') id: string) {
    console.log('id', id);
    return this.goalsService.findById(id);
  }

  @Get('client/:clientId')
  findByClientId(@Param('clientId') clientId: string) {
    return this.goalsService.findByClientId(clientId);
  }

  ////unused///////////////
  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.goalsService.findByStatus(status);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.goalsService.findByCategory(category);
  }

  @Get('search')
  findByTags(@Query('tags') tags: string | string[]) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    return this.goalsService.findByTags(tagArray);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalsService.update(id, updateGoalDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.goalsService.delete(id);
  }
}
