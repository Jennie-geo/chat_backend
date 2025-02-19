import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  password: string;
}
