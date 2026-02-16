'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/entities/auth/stores';
import { signOutAction } from '@/features/auth/sign-out/actions';

export default function SignOutButton() {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(false);

  const { signOut } = useAuthStore();

  const onClick = async () => {
    setLoading(true);
    try {
      await signOutAction();
    } finally {
      signOut();
      router.replace('/auth');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive transition-colors"
      onClick={onClick}
      disabled={isLoading}
    >
      <LogOut className="w-5 h-5" />
    </Button>
  );
}
