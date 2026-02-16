'use server';

import { cookies } from 'next/headers';

import { clientResponseWithResult } from '@/shared/apis/configs';
import { apiPatch } from '@/shared/apis/configs/fetch-request';
import { type ApiSuccessDtoWithResult } from '@/shared/apis/schemas';
import { type RefreshRequestDto } from '@/features/auth/refresh/schema';
import { type SignInAndRefreshResponseDtoForServer } from '@/features/auth/shared/schema';
import { ApiError } from '@/shared/apis/configs';
import { signInAndRefreshActions } from '@/features/auth/shared/actions';

export const refreshAction = async (body: RefreshRequestDto) =>
  clientResponseWithResult(async () => {
    const response = await apiPatch<
      ApiSuccessDtoWithResult<SignInAndRefreshResponseDtoForServer>
    >('/auth/refresh', body, { authType: 'refresh' });

    if (!response?.result) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }

    return signInAndRefreshActions(response);
  });

export const meAction = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return false;
  }

  return true;
};
