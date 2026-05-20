import type { Metadata } from 'next';
import '@/contents/u-know/u-know.css';
import '@/contents/u-know/u-know-components.css';

export const metadata: Metadata = {
  title: '너잘알 | 친구 반응 예상 놀이',
  description: '친구의 답변을 예상하고 실제 답변과 비교해보세요. 카카오톡으로 공유하는 병맛 관계 놀이!',
  openGraph: {
    title: '너잘알 | 친구 반응 예상 놀이',
    description: '친구가 뭐라고 답할지 맞혀봐 ㅋㅋ',
    type: 'website',
  },
};

export default function UKnowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
