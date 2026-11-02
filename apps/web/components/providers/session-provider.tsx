'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

import SharedSessionSync from './shared-session-sync';

interface Props {
  children: ReactNode;
}

export default function SessionProvider({ children }: Props) {
  return (
    <NextAuthSessionProvider
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <SharedSessionSync />
      {children}
    </NextAuthSessionProvider>
  );
}
