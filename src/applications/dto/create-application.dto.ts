import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApplicationDto {
  @IsString()
  clientId: string;

  @IsString()
  goalId: string;

  @IsString()
  assistantId: string;

  @IsOptional()
  @IsString()
  pitch?: string;

  @IsString()
  status: string; // "pending" | "accepted" | "rejected"

  @IsString()
  trialStatus: string; // "pending-start" | "active" | "completed" | "cancelled" | "none"
}
