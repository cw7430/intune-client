import { z } from 'zod';

export const signInAndRefreshResponseSchemaForClient = z.object({
  accessTokenExpiresAt: z.number(),
  nickName: z.string(),
  gender: z.enum(['MALE', 'FEMALE']),
  authType: z.enum(['NATIVE', 'SOCIAL', 'CROSS']),
  authRole: z.enum(['USER', 'ADMIN']),
});

export const signInAndRefreshResponseSchemaForServer =
  signInAndRefreshResponseSchemaForClient.extend({
    accessToken: z.string(),
    refreshToken: z.string(),
    refreshTokenExpiresAt: z.number(),
    isAuto: z.boolean(),
  });

export type SignInAndRefreshResponseDtoForClient = z.infer<
  typeof signInAndRefreshResponseSchemaForClient
>;

export type SignInAndRefreshResponseDtoForServer = z.infer<
  typeof signInAndRefreshResponseSchemaForServer
>;
