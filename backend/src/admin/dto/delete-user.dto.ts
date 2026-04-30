import { IsEmail, IsString, Matches } from 'class-validator';

export class DeleteUserDto {
  @IsEmail()
  confirmEmail: string;

  @IsString()
  @Matches(/^DELETE$/)
  confirmText: string;

  @IsString()
  @Matches(/^APROVAR$/)
  approvalText: string;
}
