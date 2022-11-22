import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'password is too weak.',
  })
  password: string;
}
