'use server';

import { clientResponseWithResult } from '@/shared/apis/configs';
import { apiPost } from '@/shared/apis/configs/fetch-request';
import { type ApiSuccessDtoWithResult } from '@/shared/apis/schemas';
import { type NativeSignInRequestDto } from '@/features/auth/sign-in/schema';
import { type SignInAndRefreshResponseDtoForServer } from '@/features/auth/shared/schema';
import { ApiError } from '@/shared/apis/configs';
import { signInAndRefreshActions } from '@/features/auth/shared/actions';

export const nativeSignInAction = async (body: NativeSignInRequestDto) =>
  clientResponseWithResult(async () => {
    const response = await apiPost<
      ApiSuccessDtoWithResult<SignInAndRefreshResponseDtoForServer>
    >('/auth/sign-in/native', body);

    if (!response?.result) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }

    return signInAndRefreshActions(response);
  });
