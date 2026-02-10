import { z } from 'zod';

export const authStateDataSchema = z.object({
  accessTokenExpiresAt: z.number().nullable(),
  nickName: z.string().nullable(),
  gender: z.enum(['MALE', 'FEMALE']).nullable(),
  authType: z.enum(['NATIVE', 'SOCIAL', 'CROSS']).nullable(),
  authRole: z.enum(['USER', 'ADMIN']).nullable(),
});

export type AuthState = z.infer<typeof authStateDataSchema> & {
  signIn: (
    accessTokenExpiresAt: number,
    nickName: string,
    gender: 'MALE' | 'FEMALE',
    authType: 'NATIVE' | 'SOCIAL' | 'CROSS',
    authRole: 'USER' | 'ADMIN',
  ) => void;

  checkAuth: () => boolean;

  signOut: () => void;
};
