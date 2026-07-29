import type { Metadata } from 'next';
import LandingSection from '@/components/postcard/LandingSection';

export const metadata: Metadata = {
  title: '하루엽서 | 2일짜리 감성 엽서 만들기',
  description: '사진, 음악, 메시지를 담은 나만의 하루엽서를 만들어 소중한 사람에게 전해보세요. 2일간만 열람 가능한 특별한 디지털 엽서 서비스.',
  keywords: ['하루엽서', '디지털 엽서', '감성 엽서', '사진 필터', '배경음악 엽서', '3일 엽서'],
  openGraph: {
    title: '하루엽서 | 당신의 하루에 어울리는 온도를 전해보세요',
    description: '사진, 음악, 메시지를 담은 3일짜리 감성 디지털 엽서',
    type: 'website',
  },
};

/**
 * 하루엽서 랜딩 페이지
 * 라우트: /postcard
 */
export default function PostcardLandingPage() {
  return <LandingSection />;
}
