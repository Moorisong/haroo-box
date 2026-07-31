'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Link2 } from 'lucide-react';
import { getFilterCss, getFontStyle, SHARE_MESSAGES } from '@/constants/postcard';
import type { PostcardViewData } from '@/types/postcard';
import KakaoAdfit, { ADFIT_SIZES, ADFIT_UNITS } from '@/components/ads/kakao-adfit';

import PostcardEffectOverlay from '../create/PostcardEffectOverlay';
import AdLoadingModal from './AdLoadingModal';
import ShareActionButtons from './ShareActionButtons';

import { useShareTimer } from '@/hooks/postcard/useShareTimer';
import { useShareActions } from '@/hooks/postcard/useShareActions';

interface ShareContainerProps {
  postcard: PostcardViewData;
}

export default function ShareContainer({ postcard }: ShareContainerProps) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(true);

  // 1. 커스텀 훅 - 시간 계산
  const timeRemaining = useShareTimer(postcard.expires_at);

  // 2. 커스텀 훅 - 공유 액션(카카오/복사/저장)
  const {
    shareUrl,
    copied,
    downloading,
    handleKakaoShare,
    handleCopy,
    handleDownload,
  } = useShareActions(postcard, previewRef);

  return (
    <div className="min-h-screen bg-background relative">
      {/* 광고 팝업 모달 */}
      <AdLoadingModal 
        postcardId={postcard.id} 
        onComplete={() => setIsAdModalOpen(false)} 
      />

      {/* 메인 공유 페이지 콘텐츠 */}
      <div className={`min-h-screen pb-10 transition-all duration-500 ${isAdModalOpen ? 'filter blur-md pointer-events-none select-none' : ''}`}>
        {/* 헤더 */}
        <div className="fixed top-0 left-0 right-0 z-40 max-w-[390px] mx-auto">
          <div className="h-14 flex items-center justify-center px-5 bg-background/90 backdrop-blur-md border-b border-border">
            <span
              className="text-sm tracking-[0.2em]"
              style={{ fontFamily: "'Nanum Gothic', sans-serif", color: '#6C5CE7' }}
            >
              하루엽서
            </span>
          </div>
        </div>

        <div className="pt-[72px] px-5">
          {/* 안내 메시지 */}
          <div className="text-center py-5" style={{ animation: 'fadeInUp 0.6s ease both' }}>
            <p className="text-sm text-muted-foreground">{SHARE_MESSAGES.LINK_CREATED}</p>
            <p className="text-xs text-primary mt-0.5 font-medium">⏱ {timeRemaining}</p>
          </div>

          {/* 엽서 프리뷰 (이미지 다운로드 캡처 대상) */}
          <div className="flex justify-center mb-6" style={{ animation: 'fadeInUp 0.7s 0.1s ease both' }}>
            <div
              ref={previewRef}
              className="w-[240px] rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
              style={{ aspectRatio: '3/4' }}
              onClick={() => router.push(`/postcard/view/${postcard.id}`)}
              role="button"
              aria-label="엽서 열어보기"
            >
              <div className="w-full h-full relative bg-[#F4F4F5]">
                <div className="w-full relative overflow-hidden" style={{ height: '55%' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={postcard.image_url}
                    alt="완성된 엽서"
                    className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
                    style={{
                      filter: getFilterCss(postcard.filter_type, postcard.filter_intensity),
                      objectPosition: `center ${postcard.image_offset_y}%`,
                    }}
                    crossOrigin="anonymous"
                  />
                  <PostcardEffectOverlay effectType={postcard.effect_type ?? 'none'} />
                </div>
                <div className="px-4 py-5 flex flex-col" style={{ height: '45%' }}>
                  <div className="w-full h-full overflow-y-auto scrollbar-thin flex flex-col">
                    <div className="mt-auto mb-auto w-full">
                      <p
                        className="text-xs leading-relaxed whitespace-pre-line text-[#27272A]"
                        style={getFontStyle(postcard.font_family)}
                      >
                        {postcard.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* 공유 액션 버튼 그룹 분리 */}
          <ShareActionButtons
            copied={copied}
            downloading={downloading}
            onKakaoShare={handleKakaoShare}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />

          {/* 광고 배너 */}
          <div className="w-full flex justify-center mt-6">
            <KakaoAdfit
              unit={process.env.NEXT_PUBLIC_ADFIT_UNIT_ID || ADFIT_UNITS.MAIN_BANNER}
              {...ADFIT_SIZES.BANNER_320x100}
            />
          </div>

          {/* 엽서 직접 보기 링크 */}
          <button
            onClick={() => router.push(`/postcard/view/${postcard.id}`)}
            className="w-full mt-5 py-2 text-xs text-primary text-center"
            id="postcard-share-view"
          >
            {SHARE_MESSAGES.VIEW_POSTCARD}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
