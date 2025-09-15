import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, ObjectId } from 'mongoose';
import { User } from 'schemas/user.schema';
import { ValidationException } from 'exceptions/validation.exception';
import { AUTH_ERRORS } from '../constants/auth.constants';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) public userModel: Model<User>) {}

  async findByEmail(email: string): Promise<(User & Document) | null> {
    return this.userModel.findOne({ email });
  }

  async findById(userId: ObjectId): Promise<(User & Document) | null> {
    return this.userModel.findById(userId);
  }

  async createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    refreshTokenRef: string;
  }): Promise<User & Document> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async checkUserExists(email: string): Promise<void> {
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ValidationException(
        [{ field: 'email', messages: [AUTH_ERRORS.USER_EXISTS] }],
        HttpStatus.CONFLICT,
      );
    }
  }

  async validateUserExists(email: string): Promise<User & Document> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new ValidationException(
        [{ field: 'email', messages: [AUTH_ERRORS.USER_NOT_FOUND] }],
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async validateUserExistsById(userId: ObjectId): Promise<User & Document> {
    const user = await this.findById(userId);
    if (!user) {
      throw new ValidationException(
        [{ field: 'user', messages: [AUTH_ERRORS.USER_NOT_FOUND] }],
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  sanitizeUserResponse(user: User & Document): Partial<User> {
    const { passwordHash, refreshTokenRef, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }
}
