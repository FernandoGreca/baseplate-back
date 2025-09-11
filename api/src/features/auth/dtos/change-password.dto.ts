import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPasswords', async: false })
export class MatchPasswords implements ValidatorConstraintInterface {
  validate(password_again: string, args: ValidationArguments) {
    const object: any = args.object;
    return object.password === password_again;
  }

  defaultMessage(args: ValidationArguments) {
    return 'password_again must match password';
  }
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'fernandogreca@gmail.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({ example: 'Teste@123' })
  @IsNotEmpty({ message: 'password is required' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, including uppercase, lowercase, number, and special character.',
    },
  )
  password: string;

  @ApiProperty({ example: 'Teste@123' })
  @IsNotEmpty({ message: 'password confirmation is required' })
  @Validate(MatchPasswords)
  password_again: string;
}
