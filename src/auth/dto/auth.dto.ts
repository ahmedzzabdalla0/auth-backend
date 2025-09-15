import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Match } from 'decorators/match.decorator';

// Regex for password validation - at least 8 chars with letter, number, and special char
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

export class SignupDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  readonly email: string;

  @IsString({ message: 'Password must be a string' })
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must be at least 8 characters, include a letter, number, and special character',
  })
  readonly password: string;

  @Match('password', { message: 'Passwords do not match' })
  readonly repassword: string;

  @IsString({ message: 'Name must be a string' })
  readonly name: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  readonly email: string;

  @IsString({ message: 'Password is required' })
  readonly password: string;

  @IsOptional()
  @IsBoolean({ message: 'Remember me must be a boolean value' })
  readonly rememberMe?: boolean = false;
}
