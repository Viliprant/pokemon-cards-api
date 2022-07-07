import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from 'src/validators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @IsEmail()
  mail: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;
}
