'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import {
  nativeSignUpRequestSchema,
  type NativeSignUpRequestDto,
} from '@/features/auth/sign-up/schema';
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
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { nativeSignUpAction } from '@/features/auth/sign-up/actions';
import { CheckEmailButton } from '@/features/auth/check-email/ui';

export default function SignUpForm() {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isEmailChecked, setEmailChecked] = useState<boolean>(false);

  const { signIn } = useAuthStore();

  const signUpForm = useForm<NativeSignUpRequestDto>({
    resolver: zodResolver(nativeSignUpRequestSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickName: '',
      gender: undefined,
    },
  });

  const {
    handleSubmit,
    control,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = signUpForm;

  const email = useWatch({ control, name: 'email' });
  const password = useWatch({ control, name: 'password' });
  const confirmPassword = useWatch({ control, name: 'confirmPassword' });

  const isPasswordMatch =
    password && confirmPassword && password === confirmPassword;
  const isPasswordNotMatch =
    password && confirmPassword && password !== confirmPassword;

  const onSubmit: SubmitHandler<NativeSignUpRequestDto> = async (req) => {
    setLoading(true);
    if (!isEmailChecked) {
      setError('email', {
        message: '이메일 중복체크를 해주세요',
      });
      setLoading(false);
      return;
    }
    const response = await nativeSignUpAction(req);

    if (response.code !== 'SU') {
      switch (response.code) {
        case 'DR':
          setError('email', {
            message: '이미 존재하는 이메일 입니다.',
          });
          break;
        case 'CDR':
          setError('email', {
            message: response.message,
          });
          break;
        case 'CVE':
          setError('confirmPassword', {
            message: response.message,
          });
          break;
        case 'VE':
          setError('root', {
            message: '양식이 올바르지 않습니다.',
          });
          break;
        default:
          setError('root', {
            message: '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          });
      }
      setLoading(false);
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
    <Form {...signUpForm}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    placeholder="hello@example.com"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setEmailChecked(false);
                    }}
                    className="bg-secondary/50 border-white/5"
                  />
                  <CheckEmailButton
                    email={email}
                    setError={setError}
                    clearErrors={clearErrors}
                    trigger={trigger}
                    isEmailChecked={isEmailChecked}
                    setEmailChecked={setEmailChecked}
                    setLoading={setLoading}
                  />
                </div>
              </FormControl>
              <FormMessage
                className={
                  !errors.email && isEmailChecked ? 'text-emerald-500' : ''
                }
              >
                {!errors.email && isEmailChecked && '사용 가능한 이메일입니다.'}
                {email &&
                  !errors.email &&
                  !isEmailChecked &&
                  '이메일 중복체크를 해주세요.'}
              </FormMessage>
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  {...field}
                  className="bg-secondary/50 border-white/5"
                />
              </FormControl>
              <FormMessage
                className={
                  !errors.confirmPassword && isPasswordMatch
                    ? 'text-emerald-500'
                    : ''
                }
              >
                {!errors.confirmPassword &&
                  isPasswordMatch &&
                  '비밀번호가 일치합니다.'}
                {!errors.confirmPassword &&
                  isPasswordNotMatch &&
                  '비밀번호가 일치하지 않습니다.'}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="nickName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>닉네임</FormLabel>
              <FormControl>
                <Input
                  placeholder="닉네임"
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
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>성별</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-secondary/50 border-white/5">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MALE">남성</SelectItem>
                  <SelectItem value="FEMALE">여성</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
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
            '회원가입'
          )}
        </Button>
      </form>
    </Form>
  );
}
