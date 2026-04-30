import { IsString, Matches } from 'class-validator';

export class AdminApprovalDto {
  @IsString()
  @Matches(/^APROVAR$/)
  confirmText: string;
}
