import { IsBoolean, IsDate, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(8)
  userName: string;

  @IsString()
  avatar: string;

  @IsString()
  status: string;

  @IsString()
  mobile: string;

  // @IsBoolean()
  // isActive: boolean;

  @IsBoolean()
  isDisabled: boolean;

  @IsBoolean()
  isDeleted: boolean;

  @IsDate()
  lastLogin: Date;
}
