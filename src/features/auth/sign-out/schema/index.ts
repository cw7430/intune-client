import { z } from 'zod';

export const signOutRequestSchema = z.object({
  refreshToken: z.string().nullable(),
});

export type SignOutRequestDto = z.infer<typeof signOutRequestSchema>;
