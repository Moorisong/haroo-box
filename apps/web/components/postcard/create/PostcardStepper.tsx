'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import StepUpload from './StepUpload';
import StepMessage from './StepMessage';
import StepMusic from './StepMusic';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';
import { createPostcardApi } from '@/utils/postcardApi';

const TOTAL_STEPS = 3;

/**
 * 하루엽서 제작 Stepper 컨테이너
 * - 3단계 스텝 UI (사진/문구/BGM) 동시 노출 (싱글 페이지 폼)
 * - 하단 고정 CTA: API 전송 → /postcard/ad-gate/:id 이동
 * - 취소/뒤로가기 시 Zustand 상태 초기화 (사이드 이펙트 방어)
 */
export default function PostcardStepper() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { imageFile, filterType, fontFamily, message, youtubeId, resetForm } =
    usePostcardFormStore();

  const handleBack = useCallback(() => {
    // 취소 시 폼 상태 초기화 후 랜딩으로 복귀
    resetForm();
    router.push('/postcard');
  }, [resetForm, router]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // 이미지가 없는 경우 기본 이미지 URL을 텍스트로 전송
      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        setError('사진을 먼저 업로드해 주세요.');
        setIsSubmitting(false);
        return;
      }

      formData.append('filter_type', filterType);
      formData.append('font_family', fontFamily);
      formData.append('message', message.trim() || '오늘 하루도 고생했어');
      if (youtubeId) {
        formData.append('youtube_url', `https://youtu.be/${youtubeId}`);
      }

      const result = await createPostcardApi(formData);

      // 성공 시 폼 상태 유지하고 광고 브릿지로 이동
      router.push(`/postcard/ad-gate/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '엽서 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, imageFile, filterType, fontFamily, message, youtubeId, router]);

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* 헤더 */}
      <div className="fixed top-0 left-0 right-0 z-40 max-w-[390px] mx-auto">
        <div className="h-14 flex items-center justify-between px-5 bg-background/90 backdrop-blur-md border-b border-border">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-muted-foreground"
            id="postcard-create-back"
          >
            <ChevronLeft size={18} />
            랜딩
          </button>
          <span
            className="text-sm tracking-[0.2em]"
            style={{
              fontFamily: "'Nanum Gothic', sans-serif",
              color: '#6C5CE7',
            }}
          >
            하루엽서
          </span>
          <div className="w-12" />
        </div>
      </div>

      <div className="pt-[72px] px-5">
        {/* 진행 단계 표시 */}
        <div className="flex items-center gap-2 py-5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
            <React.Fragment key={n}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium bg-primary text-white">
                {n}
              </div>
              {n < TOTAL_STEPS && <div className="flex-1 h-px bg-primary/30" />}
            </React.Fragment>
          ))}
        </div>

        {/* 스텝 컴포넌트 (싱글 페이지 폼) */}
        <StepUpload />
        <StepMessage />
        <StepMusic />
      </div>

      {/* 하단 고정 CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto px-5 py-5 bg-background/80 backdrop-blur-md">
        {error && (
          <p className="text-[11px] text-rose-400 text-center mb-2">{error}</p>
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          id="postcard-create-submit"
          className={`w-full py-4 rounded-2xl text-sm font-medium tracking-wide text-white shadow-lg transition-opacity ${
            isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, #BF8B6E 0%, #D4956B 60%, #C78B79 100%)',
          }}
        >
          {isSubmitting ? '엽서 만드는 중…' : '🔗 2일짜리 감성 엽서 링크 만들기'}
        </button>
      </div>
    </div>
  );
}
