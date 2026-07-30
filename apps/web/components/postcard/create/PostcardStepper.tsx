'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import StepUpload from './StepUpload';
import StepMessage from './StepMessage';
import StepMusic from './StepMusic';
import PostcardPreview from './PostcardPreview';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';
import { createPostcardApi } from '@/utils/postcardApi';

/**
 * 반응형 하루엽서 제작 모듈 (PostcardStepper)
 */
export default function PostcardStepper() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { imageFile, filterType, effectType, fontFamily, message, youtubeId, resetForm } =
    usePostcardFormStore();

  const handleBack = useCallback(() => {
    resetForm();
    router.push('/postcard');
  }, [resetForm, router]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        setError('사진을 먼저 업로드해 주세요.');
        setIsSubmitting(false);
        return;
      }

      formData.append('filter_type', filterType);
      formData.append('effect_type', effectType);
      formData.append('font_family', fontFamily);
      formData.append('message', message.trim() || '오늘 하루도 고생했어');
      if (youtubeId) {
        formData.append('youtube_url', `https://youtu.be/${youtubeId}`);
      }

      const result = await createPostcardApi(formData);
      router.push(`/postcard/ad-gate/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '엽서 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, imageFile, filterType, fontFamily, message, youtubeId, router]);

  return (
    <div
      className="min-h-screen bg-background pb-32"
      style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
    >
      {/* 상단 네비게이션 헤더 (명확한 구분선 반영) */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            id="postcard-create-back"
          >
            <ChevronLeft size={18} />
            랜딩으로
          </button>
          <div className="font-bold text-sm text-foreground tracking-wide">
            하루엽서 만들기
          </div>
          <div className="w-16 text-right text-[11px] text-muted-foreground hidden sm:block">
            2일간 유효
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 반응형 컨테이너 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 좌측 컬럼: 실시간 프리뷰 */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 order-1 lg:order-1">
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs">
              <PostcardPreview />
            </div>
          </div>

          {/* 우측 컬럼: 3개 Step 카드 폼 패널 */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-2">
            <StepUpload />
            <StepMessage />
            <StepMusic />
          </div>
        </div>
      </main>

      {/* 하단 고정 Submit CTA (명확한 구분선 반영) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border py-3.5 px-4">
        <div className="max-w-md lg:max-w-xl mx-auto flex flex-col items-center">
          {error && (
            <p className="text-xs text-rose-500 font-medium text-center mb-2">
              {error}
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            id="postcard-create-submit"
            className={`w-full py-3.5 px-6 rounded-xl text-sm font-bold tracking-wide text-white shadow-xs text-center transition-all active:scale-[0.99] ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-95'
            }`}
            style={{
              background: 'linear-gradient(135deg, #BF8B6E 0%, #D4956B 60%, #C78B79 100%)',
            }}
          >
            {isSubmitting ? '엽서 만드는 중…' : '2일짜리 감성 엽서 링크 만들기'}
          </button>
        </div>
      </div>
    </div>
  );
}
