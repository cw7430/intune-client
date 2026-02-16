'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import {
  nativeSignInRequestSchema,
  type NativeSignInRequestDto,
} from '@/features/auth/sign-in/schema';
import { useAppConfigStore } from '@/shared/stores';
import { useAuthStore } from '@/entities/auth/stores';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { nativeSignInAction } from '@/features/auth/sign-in/actions';

export default function SignInForm() {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(false);

  const { isAutoSignIn, setAutoSignIn } = useAppConfigStore();
  const { signIn } = useAuthStore();

  const signInForm = useForm<NativeSignInRequestDto>({
    resolver: zodResolver(nativeSignInRequestSchema),
    defaultValues: { email: '', password: '', isAuto: isAutoSignIn },
  });

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = signInForm;

  const handleFormChange = () => {
    if (errors.root) {
      clearErrors('root');
      clearErrors('email');
      clearErrors('password');
    }
  };

  const onSubmit: SubmitHandler<NativeSignInRequestDto> = async (req) => {
    setLoading(true);
    const response = await nativeSignInAction(req);

    if (response.code !== 'SU') {
      setLoading(false);

      switch (response.code) {
        case 'LGE':
        case 'VE':
          setError('root', {
            message: '아이디 또는 비밀번호가 올바르지 않습니다.',
          });
          break;

        default:
          setError('root', {
            message: '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          });
      }

      return;
    }

    const responseData = response.result;

    signIn(
      responseData.accessTokenExpiresAtMs,
      responseData.nickName,
      responseData.gender,
      responseData.authType,
      responseData.authRole,
    );

    router.replace('/');
  };

  return (
    <Form {...signInForm}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={handleFormChange}
        className="space-y-4"
      >
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  placeholder="hello@example.com"
                  {...field}
                  className="bg-secondary/50 border-white/5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  {...field}
                  className="bg-secondary/50 border-white/5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="isAuto"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-1 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setAutoSignIn(checked as boolean);
                  }}
                  disabled={isLoading}
                />
              </FormControl>
              <FormLabel>Remember Me</FormLabel>
            </FormItem>
          )}
        />
        {errors.root && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive animate-in fade-in zoom-in duration-200">
            <span className="font-medium">{errors.root.message}</span>
          </div>
        )}
        <Button
          type="submit"
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            '로그인'
          )}
        </Button>
      </form>
    </Form>
  );
}
