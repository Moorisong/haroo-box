'use client';
import { useLanguage } from '@/components/providers/language-provider';
import type { ReactNode } from 'react';

export function KoreanLegal({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  return language === 'ko' ? <>{children}</> : null;
}

const terms = [
  ['Service and scope', 'Haroo Box offers a collection of web experiences including Haroo Puzzle, Rolling Paper, Advent Chocolate Calendar, Dumpit.exe, Self Discovery, and TOBY. Some experiences are hosted on separate subdomains and may have additional rules.'],
  ['Accounts', 'Some features work without an account. Where sign-in is required, the available social login providers are displayed on the login page. Different providers may create separate accounts; records are not automatically merged.'],
  ['User content', 'Users are responsible for messages, puzzle participation, and other submissions. Do not post unlawful, abusive, infringing, or privacy-invasive material. Content may be moderated or removed for safety and service integrity.'],
  ['Availability', 'We may change, maintain, or discontinue features. We will provide notice where reasonably practicable.'],
  ['Rights', 'Service branding and materials belong to their respective owners. Users retain rights to original submissions, subject to the permissions necessary to display and operate the service.'],
  ['Contact', 'Questions or requests: thiagooo@naver.com. Korean law applies to the extent permitted by applicable law.'],
];
const privacy = [
  ['Who operates the service', 'Haroo Box operates a collection of web experiences, some on separate subdomains. This summary should be read alongside any product-specific privacy notices. Contact: thiagooo@naver.com.'],
  ['Information handled', 'Depending on the experience, this may include social login provider identifiers and profile details, game scores and rankings, messages and other user-submitted content, and technical information such as IP addresses, cookies, browser details, and access logs.'],
  ['Purposes', 'We use information to authenticate users, provide content and game records, support shared experiences, prevent abuse, maintain security, and understand service performance.'],
  ['Third-party services', 'The site uses external authentication, analytics, and advertising services. Data handling by those services is subject to their own policies. Specific vendors, transfers, and retention periods must be confirmed before this English notice is treated as final.'],
  ['Retention and deletion', 'Information is retained as necessary for service operation and legal obligations. Some content may be deleted when its associated project or account is deleted, subject to technical and legal retention requirements.'],
  ['Your choices', 'You may request access, correction, or deletion of personal information through thiagooo@naver.com. Browser settings may control cookies.'],
];
export function EnglishLegal({ kind }: { kind: 'terms' | 'privacy' }) {
  const { language } = useLanguage();
  if (language !== 'en') return null;
  const isTerms = kind === 'terms';
  return (
    <div lang="en" style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', color: '#18203a' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>{isTerms ? 'Terms of Service' : 'Privacy Policy'}</h1>
      <p style={{ marginBottom: 28, color: '#646a77' }}>Haroo Box · English information · November 10, 2026</p>
      <p style={{ marginBottom: 24, lineHeight: 1.8 }}>This English version explains the current service at a high level. The Korean policy and product-specific notices should be reviewed for additional details.</p>
      {(isTerms ? terms : privacy).map(([title, body], index) => (
        <section key={title} style={{ background: '#fffdf9', border: '1px solid #e8e1d5', borderRadius: 16, padding: 22, marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, fontWeight: 750, marginBottom: 12 }}>{index + 1}. {title}</h2>
          <p style={{ lineHeight: 1.8, fontSize: 14 }}>{body}</p>
        </section>
      ))}
    </div>
  );
}
