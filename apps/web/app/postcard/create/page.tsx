import type { Metadata } from 'next';
import PostcardStepper from '@/components/postcard/create/PostcardStepper';

export const metadata: Metadata = {
  title: '하루엽서 만들기',
  description: '사진, 필터, 문구, 폰트, BGM을 조합해 나만의 하루엽서를 만들어보세요.',
};

/**
 * 하루엽서 제작 페이지
 * 라우트: /postcard/create
 */
export default function PostcardCreatePage() {
  return <PostcardStepper />;
}
