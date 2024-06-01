import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be of atleast 3 characters' })
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user. Must be at least 3 characters long.',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  @ApiProperty({
    example: 'johndoe@gmail.com',
    description: 'The email address of the user. Must be a valid email format.',
  })
  email: string;
}
