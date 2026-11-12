'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

import { ROUTES } from '@/constants';
import { useLanguage } from '@/components/providers/language-provider';

import styles from './page.module.css';

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || ROUTES.HOME;

  const { t } = useLanguage();

  const handleKakaoLogin = () => {
    signIn('kakao', { callbackUrl });
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('로그인', 'Log in')}</h1>
          <p className={styles.subtitle}>{t('하루상자에 오신 걸 환영해요!', 'Welcome to Haroo Box!')}</p>
        </div>

        <div className={styles.buttons}>
          <button onClick={handleKakaoLogin} className={styles.kakaoButton}>
            <svg
              className={styles.kakaoIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.85 1.89 5.35 4.72 6.77-.15.53-.96 3.39-1 3.56 0 .05-.01.1-.01.15 0 .16.08.3.22.37.08.04.16.05.24.05.13 0 .26-.05.37-.13.52-.37 4.03-2.73 4.67-3.16.59.08 1.19.12 1.79.12 5.52 0 10-3.58 10-8s-4.48-8-10-8" />
            </svg>
            {t('카카오로 계속하기', 'Continue with Kakao')}
          </button>

          <button onClick={handleGoogleLogin} className={styles.googleButton}>
            <svg
              className={styles.googleIcon}
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {t('Google로 계속하기', 'Continue with Google')}
          </button>
        </div>

        <p className={styles.notice}>
          {t('로그인하면 ', 'By logging in, you agree to our ')}{' '}
          <Link href={ROUTES.TERMS} className={styles.noticeLink}>{t('서비스 이용약관', 'Terms of Service')}</Link>
          {' '}{t('및', 'and')}{' '}
          <Link href={ROUTES.PRIVACY} className={styles.noticeLink}>{t('개인정보처리방침', 'Privacy Policy')}</Link>
          {t('에 동의하게 됩니다.', '.')}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.container}><div className={styles.card}>Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}
