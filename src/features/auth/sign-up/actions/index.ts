'use server';

import { clientResponseWithResult } from '@/shared/apis/configs';
import { apiPost } from '@/shared/apis/configs/fetch-request';
import { type ApiSuccessDtoWithResult } from '@/shared/apis/schemas';
import { type NativeSignUpRequestDto } from '@/features/auth/sign-up/schema';
import { type SignInAndRefreshResponseDtoForServer } from '@/features/auth/shared/schema';
import { ApiError } from '@/shared/apis/configs';
import { signInAndRefreshActions } from '@/features/auth/shared/actions';

export const nativeSignUpAction = async (body: NativeSignUpRequestDto) =>
  clientResponseWithResult(async () => {
    if (body.password !== body.confirmPassword) {
      throw new ApiError('CVE', '비밀번호가 일치하지 않습니다.');
    }

    const { confirmPassword, ...payload } = body;

    const response = await apiPost<
      ApiSuccessDtoWithResult<SignInAndRefreshResponseDtoForServer>
    >('/auth/sign-up/native', payload);

    if (!response?.result) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }

    return signInAndRefreshActions(response);
  });
