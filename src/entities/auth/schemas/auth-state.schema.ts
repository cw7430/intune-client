import { z } from 'zod';

import { signInAndRefreshResponseSchemaForClient } from '@/features/auth/shared/schema';

export const authStateDataSchema = signInAndRefreshResponseSchemaForClient
  .partial()
  .extend({
    accessTokenExpiresAtMs: z.number().nullable(),
    nickName: z.string().nullable(),
    gender: z.enum(['MALE', 'FEMALE']).nullable(),
    authType: z.enum(['NATIVE', 'SOCIAL', 'CROSS']).nullable(),
    authRole: z.enum(['USER', 'ADMIN']).nullable(),
  });

export type AuthStateData = z.infer<typeof authStateDataSchema>;

export type AuthState = AuthStateData & {
  hasHydrated: boolean;

  setHasHydrated: (v: boolean) => void;

  signIn: (
    accessTokenExpiresAtMs: number,
    nickName: string,
    gender: 'MALE' | 'FEMALE',
    authType: 'NATIVE' | 'SOCIAL' | 'CROSS',
    authRole: 'USER' | 'ADMIN',
  ) => void;

  checkAuth: () => boolean;

  signOut: () => void;
};
