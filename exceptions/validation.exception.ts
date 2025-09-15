import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(
    inputErrors: { field: string; messages: string[] }[],
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ inputErrors }, statusCode);
  }
}
