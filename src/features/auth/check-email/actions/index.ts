'use server';

import { clientResponseSingle } from '@/shared/apis/configs';
import { apiPost } from '@/shared/apis/configs/fetch-request';
import { type ApiSuccessDtoSingle } from '@/shared/apis/schemas';
import { type CheckEmailRequestDto } from '@/features/auth/check-email/schema';
import { ApiError } from '@/shared/apis/configs';

export const checkEmailActions = async (body: CheckEmailRequestDto) =>
  clientResponseSingle(async () => {
    if (!body.email) {
      throw new ApiError('CDR', '이메일을 입력해주세요.');
    }

    const response = await apiPost<ApiSuccessDtoSingle>(
      '/auth/check-email',
      body,
    );

    if (!response) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }
  });
