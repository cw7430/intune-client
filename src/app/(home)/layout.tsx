import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { Navigation } from '@/widgets';
import { AuthInitializer } from '@/features/auth/refresh/ui';

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  if (!refreshToken) {
    redirect('/auth');
  }

  return (
    <>
      <AuthInitializer />
      <Navigation />
      {children}
    </>
  );
}
