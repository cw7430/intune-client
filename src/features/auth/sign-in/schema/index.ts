import { z } from 'zod';

export const signInRequestSchema = z.object({
  email: z
    .string()
    .min(1, '이메일 입력해주세요.')
    .pipe(z.email('이메일 형식이 올바르지 않습니다.')),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
  isAuto: z.boolean(),
});

export type SignInRequestDto = z.infer<typeof signInRequestSchema>;
