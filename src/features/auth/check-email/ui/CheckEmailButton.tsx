import { Button } from '@/shared/ui/button';
import { UseFormSetError, UseFormClearErrors } from 'react-hook-form';

import type { NativeSignUpRequestDto } from '@/features/auth/sign-up/schema';

interface Props {
  email: string;
  setError: UseFormSetError<NativeSignUpRequestDto>;
  clearErrors: UseFormClearErrors<NativeSignUpRequestDto>;
}

export default function CheckEmailButton(props: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      className="shrink-0 px-4 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
    >
      중복체크
    </Button>
  );
}
