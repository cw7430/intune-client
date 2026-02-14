import { z } from 'zod';
import { ResponseCode } from '@/shared/apis/constants';

const apiBaseSchema = z.object({
  code: z.enum(ResponseCode),
  message: z.string(),
});

const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});

export const apiSuccessSchemaSchemaSingle = apiBaseSchema.extend({
  code: z.literal('SU'),
  message: z.literal('요청이 성공적으로 처리되었습니다.'),
});

export const apiSuccessSchemaWithResult = <T extends z.ZodTypeAny>(
  resultSchema: T,
) =>
  apiSuccessSchemaSchemaSingle.extend({
    result: resultSchema,
  });

export const apiFailSchema = apiBaseSchema.extend({
  code: z.enum(ResponseCode).exclude(['SUCCESS']),
  errors: z.array(validationErrorSchema).optional(),
});

export type ApiSuccessDtoSingle = z.infer<
  typeof apiSuccessSchemaSchemaSingle
>;

export type ApiSuccessDtoWithResult<T> = z.infer<
  ReturnType<typeof apiSuccessSchemaWithResult<z.ZodType<T>>>
>;

export type ApiFailDto = z.infer<typeof apiFailSchema>;

export type ValidationErrorDto = z.infer<typeof validationErrorSchema>;

export type ClientResponseDtoSingle = ApiSuccessDtoSingle | ApiFailDto;

export type ClientResponseDtoWithResult<T> =
  | ApiSuccessDtoWithResult<T>
  | ApiFailDto;
