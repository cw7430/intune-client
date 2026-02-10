import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppConfigState {
  isAutoSignIn: boolean;
  setAutoSignIn: (isAuto: boolean) => void;
}

export const useAppConfigStore = create<AppConfigState>()(
  persist(
    (set) => ({
      isAutoSignIn: false,
      setAutoSignIn: (isAutoSignIn: boolean) => set({ isAutoSignIn }),
    }),
    {
      name: 'app-config-storage',
    },
  ),
);
