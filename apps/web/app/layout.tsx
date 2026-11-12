import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import NavBar from '@/components/layout/nav-bar';
import Footer from '@/components/layout/footer';
import MainLayoutWrapper from '@/components/layout/main-layout-wrapper';
import SessionProvider from '@/components/providers/session-provider';
import { LanguageProvider } from '@/components/providers/language-provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://box.harooo.co.kr';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: '하루상자 | 즐거움과 유익함이 가득한 일일 콘텐츠 플랫폼',
    template: '%s | 하루상자',
  },
  description: '힐링 퍼즐, 감정 배출 유틸리티, 소통형 미니게임, 그리고 교사를 위한 서비스 툴까지. 하루상자에서 매일 새로운 즐거움과 유용한 도구를 만나보세요.',
  keywords: [
    '하루상자', 'Haroo Box', '미니콘텐츠', '웹 플랫폼',
    '감쓰', '감쓰.exe', '감정쓰레기통', '스트레스 해소',
    '하루퍼즐', '주간 랭킹', '직소퍼즐', '웹 퍼즐 게임', '힐링 게임',
    '롤링페이퍼', '온라인 롤링페이퍼', '익명 롤링페이퍼',
    '자아탐험', '조하리의 창',
    'TOBY', '토비', '교사 도구', '교사 전용 툴', '선생님 도구', '학급 관리'
  ],
  authors: [{ name: '하루상자' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: '하루상자 | 즐거움과 유익함이 가득한 일일 콘텐츠 플랫폼',
    description: '퍼즐, 감쓰, 롤링페이퍼부터 교사 도구(TOBY)까지! 즐거움과 유익함이 공존하는 하루상자.',
    url: baseUrl,
    type: 'website',
    locale: 'ko_KR',
    siteName: '하루상자',
    images: [
      {
        url: '/haroo-og-image-v2.png',
        width: 1200,
        height: 630,
        alt: '하루상자 메인 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '하루상자 | 즐거움과 유익함이 가득한 일일 콘텐츠 플랫폼',
    description: '퍼즐, 감쓰, 롤링페이퍼부터 교사 도구(TOBY)까지! 즐거움과 유익함이 공존하는 하루상자.',
    images: ['/haroo-og-image-v2.png'],
  },
  verification: {
    google: 'GJkux3dG0XvGE5LoRJpXkmMRtqjW8Ez5E1Zm7ORSflU',
    other: {
      'naver-site-verification': 'naverdf6af2d554af798e7a69e37a74d78c40.html',
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7385326156685780"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-KR27SQBQ"
          strategy="afterInteractive"
        />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="lazyOnload"
        />
        <SessionProvider>
          <LanguageProvider>
          <NavBar />
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
          <Footer />
          </LanguageProvider>
        </SessionProvider>

      </body>
    </html>
  );
}
