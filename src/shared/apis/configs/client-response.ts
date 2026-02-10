import {
  ClientResponseDtoSingle,
  ClientResponseDtoWithResult,
  ValidationErrorDto,
} from '@/shared/apis/schemas';
import type { ResponseCode } from '@/shared/apis/constants';
import { ApiError } from './api-error';

const successSingle = (): ClientResponseDtoSingle => ({
  code: 'SU',
  message: '요청이 성공적으로 처리되었습니다.',
});

const successWithResult = <T>(result: T): ClientResponseDtoWithResult<T> => ({
  code: 'SU',
  message: '요청이 성공적으로 처리되었습니다.',
  result,
});

const fail = (
  code: Exclude<ResponseCode, 'SU'>,
  message: string,
  errors?: ValidationErrorDto[],
): ClientResponseDtoWithResult<never> => ({
  code,
  message,
  errors,
});

export const clientResponseSingle = (
  fn: () => Promise<void>,
): Promise<ClientResponseDtoSingle> =>
  (async () => {
    try {
      await fn();
      return successSingle();
    } catch (e) {
      if (e instanceof ApiError) {
        return fail(e.code, e.message, e.errors);
      }
      throw e;
    }
  })();

export const clientResponseWithResult = <T>(
  fn: () => Promise<T>,
): Promise<ClientResponseDtoWithResult<T>> =>
  (async () => {
    try {
      const result = await fn();
      return successWithResult(result);
    } catch (e) {
      if (e instanceof ApiError) {
        return fail(e.code, e.message, e.errors);
      }
      throw e;
    }
  })();
