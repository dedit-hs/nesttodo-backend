import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15, { message: 'Max title length is 15 characters.' })
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
