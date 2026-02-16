import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthStateData, AuthState } from '@/entities/auth/schemas';

const initialState = {
  accessTokenExpiresAtMs: null,
  nickName: null,
  gender: null,
  authType: null,
  authRole: null,
};

const validateAuthIntegrity = (state: AuthStateData): boolean => {
  const {
    accessTokenExpiresAtMs,
    nickName,
    gender,
    authType,
    authRole,
  } = state;

  return !!(
    nickName &&
    gender &&
    authType &&
    authRole &&
    accessTokenExpiresAtMs &&
    Date.now() + 30 * 1000 < accessTokenExpiresAtMs
  );
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      hasHydrated: false,

      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),

      signIn: (
        accessTokenExpiresAtMs: number,
        nickName: string,
        gender: 'MALE' | 'FEMALE',
        authType: 'NATIVE' | 'SOCIAL' | 'CROSS',
        authRole: 'USER' | 'ADMIN',
      ) =>
        set({
          accessTokenExpiresAtMs,
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

      partialize: (state) => ({
        accessTokenExpiresAtMs: state.accessTokenExpiresAtMs,
        nickName: state.nickName,
        gender: state.gender,
        authType: state.authType,
        authRole: state.authRole,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
