'use client';

import { useState } from 'react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { SignInForm } from '@/features/auth/sign-in/ui';
import { SignUpForm } from '@/features/auth/sign-up/ui';

export default function AuthTebs() {
  const [activeTab, setActiveTab] = useState<'sign-in' | 'sign-up'>('sign-in');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as 'sign-in' | 'sign-up')}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
        <TabsTrigger value="sign-in">로그인</TabsTrigger>
        <TabsTrigger value="sign-up">회원가입</TabsTrigger>
      </TabsList>
      <TabsContent value="sign-in">
        <SignInForm />
      </TabsContent>
      <TabsContent value="sign-up">
        <SignUpForm />
      </TabsContent>
    </Tabs>
  );
}
