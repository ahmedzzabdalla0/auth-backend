import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Match } from 'decorators/match.decorator';

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

export class SignupDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Valid email address of the user',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  readonly email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description:
      'Password must be at least 8 characters, include a letter, number, and special character',
  })
  @IsString({ message: 'Password must be a string' })
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must be at least 8 characters, include a letter, number, and special character',
  })
  readonly password: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Must match the password field',
  })
  @Match('password', { message: 'Passwords do not match' })
  readonly repassword: string;

  @ApiProperty({
    example: 'Ahmed Mohamed',
    description: 'Full name of the user',
  })
  @IsString({ message: 'Name must be a string' })
  readonly name: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Registered email address of the user',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  readonly email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Password of the account',
  })
  @IsString({ message: 'Password is required' })
  readonly password: string;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Optional flag to keep the user logged in (default: false)',
  })
  @IsOptional()
  @IsBoolean({ message: 'Remember me must be a boolean value' })
  readonly rememberMe?: boolean = false;
}
