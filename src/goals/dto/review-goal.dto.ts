import { IsIn, IsOptional, IsString } from 'class-validator';

export class ReviewGoalDto {
  @IsIn(['approved', 'rejected'])
  action: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  comment?: string;
}
