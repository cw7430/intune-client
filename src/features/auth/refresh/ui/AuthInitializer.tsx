'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { useAppConfigStore } from '@/shared/stores';
import { useAuthStore } from '@/entities/auth/stores';
import { refreshAction, meAction } from '@/features/auth/refresh/actions';
import type { RefreshRequestDto } from '@/features/auth/refresh/schema';

export default function AuthInitializer() {
  const router = useRouter();
  const { isAutoSignIn } = useAppConfigStore();
  const { signIn, signOut } = useAuthStore();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const [isRecoveryLoading, setRecoveryLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const refresh = useCallback(
    async (req: RefreshRequestDto, isRecovery: boolean = false) => {
      if (isRecovery) setRecoveryLoading(true);

      try {
        const response = await refreshAction(req);
        if (response.code !== 'SU') {
          signOut();
          toast('세션이 만료되었습니다.');
          router.replace('/auth');
          return null;
        }

        const data = response.result;
        signIn(
          data.accessTokenExpiresAtMs,
          data.nickName,
          data.gender,
          data.authType,
          data.authRole,
        );

        return data.accessTokenExpiresAtMs;
      } finally {
        if (isRecovery) setRecoveryLoading(false);
      }
    },
    [router, signIn, signOut],
  );

  const scheduleRefresh = useCallback(
    (expiresAt: number, req: RefreshRequestDto) => {
      clearRefreshTimer();

      const now = Date.now();
      const timeUntilRefresh = Math.max(0, expiresAt - now - 2 * 60 * 1000);

      timerRef.current = setTimeout(async () => {
        const newExpiresAt = await refresh(req);
        if (newExpiresAt) scheduleRefresh(newExpiresAt, req);
      }, timeUntilRefresh);
    },
    [refresh, clearRefreshTimer],
  );

  const recoverAuth = useCallback(
    async (req: RefreshRequestDto) => {
      const currentState = useAuthStore.getState();
      const currentExpiry = currentState.accessTokenExpiresAtMs;
      const isAuthValid = currentState.checkAuth();

      const me = await meAction();

      if (me && isAuthValid && currentExpiry) {
        scheduleRefresh(currentExpiry, req);
        return;
      }

      const newExpiresAt = await refresh(req, true);
      if (newExpiresAt) {
        scheduleRefresh(newExpiresAt, req);
      }
    },
    [scheduleRefresh, refresh],
  );

  useEffect(() => {
    if (!hasHydrated) return;

    const req: RefreshRequestDto = { isAuto: isAutoSignIn };
    recoverAuth(req);

    return () => clearRefreshTimer();
  }, [hasHydrated, isAutoSignIn, recoverAuth, clearRefreshTimer]);

  if (isRecoveryLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
}
