import type { Metadata } from 'next';
import ViewContainer from '@/components/postcard/view/ViewContainer';
import { getPostcardApi } from '@/utils/postcardApi';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '하루엽서가 도착했어요 🌸',
    description: '소중한 사람이 보낸 하루엽서를 열어보세요. 3일간만 열람 가능합니다.',
    openGraph: {
      title: '🌸 하루엽서가 도착했어요',
      description: '특별한 사람이 당신을 위해 만든 감성 엽서입니다.',
      type: 'website',
    },
    robots: { index: false, follow: false },
  };
}

/**
 * 엽서 뷰어 페이지
 * 라우트: /postcard/view/[id]
 * - 서버사이드 데이터 페칭 후 만료/정상 분기를 ViewContainer에 위임
 */
export default async function ViewPage({ params }: Props) {
  const { id } = await params;
  const result = await getPostcardApi(id);

  // 만료된 경우
  if (result.expired) {
    return <ViewContainer postcard={null} expired={true} />;
  }

  // 존재하지 않는 경우
  if (result.status === 404 || !result.data) {
    return <ViewContainer postcard={null} expired={true} />;
  }

  return <ViewContainer postcard={result.data.data} expired={false} />;
}
