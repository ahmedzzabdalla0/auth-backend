import { IsBoolean, IsEmail, IsString, Matches } from 'class-validator';
import { Match } from 'decorators/match.decorator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
    {
      message:
        'Password must be at least 8 characters, include a letter, number, and special character',
    },
  )
  password: string;

  @Match('password', { message: 'Passwords do not match' })
  repassword: string;

  @IsString()
  name: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
    {
      message: 'Invalid password',
    },
  )
  password: string;

  @IsBoolean()
  rememberMe: boolean;
}

export class logoutDto {
  @IsString()
  userId: string;
}
