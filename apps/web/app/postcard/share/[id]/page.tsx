import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ShareContainer from '@/components/postcard/share/ShareContainer';
import { getPostcardApi } from '@/utils/postcardApi';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: '하루엽서 공유',
    description: `하루엽서 #${id} — 링크가 생성되었습니다. 3일간만 열람 가능합니다.`,
    robots: { index: false, follow: false },
  };
}

/**
 * 공유 완료 페이지
 * 라우트: /postcard/share/[id]
 * - 서버사이드에서 엽서 데이터 페칭
 * - 만료/없음 → notFound(), 정상 → ShareContainer
 */
export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const result = await getPostcardApi(id);

  if (result.status === 404 || !result.data) {
    notFound();
  }

  // 만료된 경우 뷰어 페이지로 리다이렉트 (만료 UI 재사용)
  if (result.expired) {
    const { redirect } = await import('next/navigation');
    redirect(`/postcard/view/${id}`);
  }

  return <ShareContainer postcard={result.data.data} />;
}
