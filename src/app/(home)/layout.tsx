import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

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

  return <>{children}</>;
}
