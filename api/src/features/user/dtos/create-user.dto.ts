import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  Matches,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'Fernando' })
  @IsNotEmpty({ message: 'name is required' })
  first_name: string;

  @IsString()
  @ApiProperty({ example: 'Greca' })
  last_name: string;

  @IsEmail()
  @ApiProperty({ example: 'fernandogreca@gmail.com' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, including uppercase, lowercase, number, and special character.',
    },
  )
  @ApiProperty({ example: 'Teste@123' })
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
