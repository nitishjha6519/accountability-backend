import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  applicationId: string;

  @IsString()
  providedBy: string;

  @IsString()
  receivedBy: string;

  @IsString()
  sessionDate: string; // format: "YYYY-MM-DD"

  @IsBoolean()
  clientPresent: boolean;

  @IsBoolean()
  assistantPresent: boolean;

  @IsNumber()
  @Min(1)
  @Max(5)
  stars: number; // 1-5 rating

  @IsOptional()
  @IsString()
  comment?: string;
}
