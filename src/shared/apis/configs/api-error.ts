import type { ValidationErrorDto } from '@/shared/apis/schemas';
import type { ResponseCode } from '@/shared/apis/constants';

export class ApiError extends Error {
  public readonly code: Exclude<ResponseCode, 'SU'>;
  public readonly errors?: ValidationErrorDto[];

  constructor(
    code: Exclude<ResponseCode, 'SU'>,
    message: string,
    errors?: ValidationErrorDto[],
  ) {
    super(message);
    this.code = code;
    this.errors = errors;
    this.name = 'ApiError';
  }
}
