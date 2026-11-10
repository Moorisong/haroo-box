'use client';

import { signIn, useSession } from 'next-auth/react';
import { markSharedLoginStarted } from '@/lib/shared-session-cookie';
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

  /*
  // 로그인 상태일 때 리다이렉트 (사용자 피드백으로 일시 비활성화 후 원인 파악 중)
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(ROUTES.HOME);
    }
  }, [status, router]);
  */

  const handleKakaoLogin = () => {
    markSharedLoginStarted();
    signIn('kakao', { callbackUrl });
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

