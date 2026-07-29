import type { Metadata } from 'next';
import AdGateContainer from '@/components/postcard/ad-gate/AdGateContainer';

export const metadata: Metadata = {
  title: '하루엽서 준비 중',
  description: '소중한 엽서를 담는 중입니다.',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * 광고 브릿지 페이지
 * 라우트: /postcard/ad-gate/[id]
 */
export default async function AdGatePage({ params }: Props) {
  const { id } = await params;
  return <AdGateContainer postcardId={id} />;
}
