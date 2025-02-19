import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  password: string;
}
