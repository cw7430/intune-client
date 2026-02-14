'use server';

import { cookies } from 'next/headers';

import { type SignOutRequestDto } from '@/features/auth/sign-out/schema';
import { apiPost } from '@/shared/apis/configs/fetch-request';
import { type ApiSuccessDtoSingle } from '@/shared/apis/schemas';

export const signOutAction = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value || null;

  const body: SignOutRequestDto = { refreshToken };

  try {
    await apiPost<ApiSuccessDtoSingle>('/auth/sign-out', body);
  } catch (error) {
    console.error('Sign-out API call failed:', error);
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
};
