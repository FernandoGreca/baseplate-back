import { IsEmail, IsEmpty, IsString, Matches } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'Fernando Greca' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'fernandogreca@gmail.com' })
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, including uppercase, lowercase, number, and special character.',
    },
  )
  @ApiProperty({ example: 'Teste@123' })
  password: string;
}
