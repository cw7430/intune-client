import { type SetStateAction } from 'react';
import {
  type UseFormSetError,
  type UseFormClearErrors,
  type UseFormTrigger,
} from 'react-hook-form';

import { type NativeSignUpRequestDto } from '@/features/auth/sign-up/schema';
import { Button } from '@/shared/ui/button';
import { checkEmailActions } from '@/features/auth/check-email/actions';

interface Props {
  email: string;
  setError: UseFormSetError<NativeSignUpRequestDto>;
  clearErrors: UseFormClearErrors<NativeSignUpRequestDto>;
  trigger: UseFormTrigger<NativeSignUpRequestDto>;
  isEmailChecked: boolean;
  setEmailChecked: React.Dispatch<SetStateAction<boolean>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}

export default function CheckEmailButton(props: Props) {
  const {
    email,
    setError,
    clearErrors,
    trigger,
    isEmailChecked,
    setEmailChecked,
    setLoading,
  } = props;

  const onClick = async () => {
    clearErrors('email');
    const isValid = await trigger('email');

    if (!email || !isValid) {
      setEmailChecked(false);
      setLoading(false);
      return;
    }
    const req = { email };
    const response = await checkEmailActions(req);

    if (response.code !== 'SU') {
      switch (response.code) {
        case 'DR':
          setError('email', {
            message: '이미 존재하는 이메일 입니다.',
          });
          break;
        case 'CVE':
          setError('email', {
            message: response.message,
          });
          break;
        case 'VE':
          setError('email', {
            message: '이메일 양식이 올바르지 않습니다.',
          });
          break;
        default:
          setError('root', {
            message: '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          });
      }
      setEmailChecked(false);
      return;
    }

    setEmailChecked(true);
    setLoading(false);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="shrink-0 px-4 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
      onClick={onClick}
      disabled={isEmailChecked}
    >
      중복체크
    </Button>
  );
}
