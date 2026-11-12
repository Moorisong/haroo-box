'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants';
import styles from './footer.module.css';
import { useLanguage } from '@/components/providers/language-provider';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  // Toby 및 puzzle 서비스에서는 푸터를 보이지 않게 처리
  if (pathname.startsWith('/toby') || pathname.startsWith('/puzzle')) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <Link href={ROUTES.TERMS} className={styles.link}>
            {t('이용약관', 'Terms of Service')}
          </Link>
          <span className={styles.separator}>·</span>
          <Link href={ROUTES.PRIVACY} className={styles.link}>
            {t('개인정보처리방침', 'Privacy Policy')}
          </Link>
          <span className={styles.separator}>·</span>
          <a href="https://github.com/Moorisong/haroo-box" target="_blank" rel="noopener noreferrer" className={styles.link}>
            GitHub
          </a>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} KSH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
