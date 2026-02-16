'use server';

import { cookies } from 'next/headers';

import { ApiSuccessDtoWithResult } from '@/shared/apis/schemas';
import { type SignInAndRefreshResponseDtoForServer } from '@/features/auth/shared/schema';

export const signInAndRefreshActions = async (
  response: ApiSuccessDtoWithResult<SignInAndRefreshResponseDtoForServer>,
) => {
  const result = response.result;
  const cookieStore = await cookies();

  const refreshMaxAge = result.isAuto
    ? Math.max(
        0,
        Math.floor((result.refreshTokenExpiresAtMs - Date.now()) / 1000),
      )
    : undefined;

  const isSecure = process.env.APP_ENV !== 'local';

  cookieStore.set({
    name: 'accessToken',
    value: result.accessToken,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isSecure,
  });

  cookieStore.set({
    name: 'refreshToken',
    value: result.refreshToken,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isSecure,
    ...(refreshMaxAge !== undefined && { maxAge: refreshMaxAge }),
  });

  const {
    refreshToken: _refreshToken,
    refreshTokenExpiresAtMs: _refreshTokenExpiresAtMs,
    isAuto: _isAuto,
    accessToken: _accessToken,
    ...clientData
  } = result;

  return clientData;
};
