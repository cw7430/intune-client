import { z } from 'zod';

export const checkEmailRequestSchema = z.object({
  email: z
    .string()
    .min(1, '이메일 입력해주세요.')
    .pipe(z.email('이메일 형식이 올바르지 않습니다.')),
});

export type CheckEmailRequestDto = z.infer<typeof checkEmailRequestSchema>;
