import { Injectable } from '@nestjs/common';
import { ValidationException } from 'exceptions/validation.exception';

@Injectable()
export class AuthValidator {
  validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationException(
        [{ field: 'email', messages: ['Invalid email format'] }],
        400,
      );
    }
  }

  validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new ValidationException(
        [
          {
            field: 'name',
            messages: ['Name must be at least 2 characters long'],
          },
        ],
        400,
      );
    }

    if (name.length > 50) {
      throw new ValidationException(
        [{ field: 'name', messages: ['Name must not exceed 50 characters'] }],
        400,
      );
    }
  }

  validateSignupData(name: string, email: string, password: string): void {
    this.validateName(name);
    this.validateEmail(email);

    if (!password || password.length < 8) {
      throw new ValidationException(
        [
          {
            field: 'password',
            messages: ['Password must be at least 8 characters long'],
          },
        ],
        400,
      );
    }
  }

  validateLoginData(email: string, password: string): void {
    this.validateEmail(email);

    if (!password) {
      throw new ValidationException(
        [{ field: 'password', messages: ['Password is required'] }],
        400,
      );
    }
  }
}
