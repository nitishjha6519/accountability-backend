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
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  //@UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(createGoalDto);
  }

  @Get('all')
  findAll() {
    return this.goalsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
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
