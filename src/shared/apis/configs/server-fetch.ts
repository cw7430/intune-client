import { cookies } from 'next/headers';

import { ApiError } from './api-error';

type CacheStrategy =
  | { type: 'no-store' }
  | { type: 'force-cache' }
  | { type: 'revalidate'; seconds: number }
  | { type: 'tags'; tags: string[] };

type AuthType = 'access' | 'refresh' | 'none';

export interface FetchOptions extends RequestInit {
  next?: NextFetchRequestConfig;
  authType?: AuthType;
  cacheStrategy?: CacheStrategy;
}

const API_BASE_URL = process.env.API_URL!;

const resolveAuthOptions = async (authType: AuthType) => {
  if (authType === 'none') return null;

  const cookieStore = await cookies();
  const cookieKey = authType === 'access' ? 'accessToken' : 'refreshToken';
  const bearerToken = cookieStore.get(cookieKey)?.value;

  if (!bearerToken) {
    throw new ApiError('UA', '로그인이 필요합니다.');
  }

  return bearerToken;
};

const resolveCacheOptions = (
  strategy?: CacheStrategy,
): Pick<RequestInit, 'cache' | 'next'> => {
  if (!strategy) {
    return { cache: 'no-store' };
  }

  switch (strategy.type) {
    case 'no-store':
      return { cache: 'no-store' };

    case 'force-cache':
      return { cache: 'force-cache' };

    case 'revalidate':
      return {
        next: { revalidate: strategy.seconds },
      };

    case 'tags':
      return {
        next: { tags: strategy.tags },
      };
  }
};

export const serverFetch = async <T>(
  input: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { authType = 'none', cacheStrategy, ...init } = options;

  const bearerToken = await resolveAuthOptions(authType);

  const cacheOptions = resolveCacheOptions(cacheStrategy);

  const res = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    ...cacheOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
      ...init?.headers,
    },
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(
      data?.code ?? 'ISE',
      data?.message ?? '서버에서 문제가 발생했습니다.',
      data?.errors,
    );
  }

  return data;
};
