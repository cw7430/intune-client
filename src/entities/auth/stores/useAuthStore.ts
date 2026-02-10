import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthState } from '@/entities/auth/schemas';

const initialState = {
  accessTokenExpiresAt: null,
  nickName: null,
  gender: null,
  authType: null,
  authRole: null,
};

const validateAuthIntegrity = (state: AuthState): boolean => {
  const { accessTokenExpiresAt, nickName, gender, authType, authRole } = state;

  return !!(
    nickName &&
    gender &&
    authType &&
    authRole &&
    accessTokenExpiresAt &&
    Date.now() + 30 * 1000 < accessTokenExpiresAt
  );
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      signIn: (
        accessTokenExpiresAt: number,
        nickName: string,
        gender: 'MALE' | 'FEMALE',
        authType: 'NATIVE' | 'SOCIAL' | 'CROSS',
        authRole: 'USER' | 'ADMIN',
      ) =>
        set({
          accessTokenExpiresAt,
          nickName,
          gender,
          authType,
          authRole,
        }),

      checkAuth: () => validateAuthIntegrity(get()),

      signOut: () => set(initialState),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
