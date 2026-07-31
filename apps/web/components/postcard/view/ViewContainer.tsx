'use client';

import React, { useState, useCallback, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import KakaoAdfit, { ADFIT_SIZES, ADFIT_UNITS } from '@/components/ads/kakao-adfit';
import { Download } from 'lucide-react';
import { useShareTimer } from '@/hooks/postcard/useShareTimer';
import { useShareActions } from '@/hooks/postcard/useShareActions';
import { SHARE_MESSAGES } from '@/constants/postcard';
import AudioConsentModal from './AudioConsentModal';
import AudioPlayerBar from './AudioPlayerBar';
import Postcard3DCanvas from './Postcard3DCanvas';
import ExpiredCard from './ExpiredCard';
import type { PostcardViewData } from '@/types/postcard';

interface ViewContainerProps {
  postcard: PostcardViewData | null;
  expired: boolean;
}

/**
 * 엽서 뷰어 컨테이너
 * - expired: true → ExpiredCard 렌더링 (빈티지 티켓 만료 UI)
 * - 정상 → 1단계(오디오 동의 모달) → 2단계(3D 뷰어 + 오디오 바)
 * - 유튜브 iframe: 1×1 픽셀 숨김 플레이어 (autoplay 정책 우회)
 */
export default function ViewContainer({ postcard, expired }: ViewContainerProps) {
  const hasYoutubeId = Boolean(postcard?.youtube_id);
  const [musicModal, setMusicModal] = useState(hasYoutubeId);
  const [withMusic, setWithMusic] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cardVisible, setCardVisible] = useState(!hasYoutubeId);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  // 훅 호출은 조건부 렌더링(만료 카드) 이전에 위치해야 하므로 더미 데이터 활용
  const safePostcard = postcard || ({} as PostcardViewData);
  const timeRemaining = useShareTimer(safePostcard.expires_at || new Date().toISOString());
  const { downloading, handleDownload } = useShareActions(safePostcard, captureRef);

  // 유튜브 iframe postMessage로 재생/일시정지 제어
  const sendPlayerCommand = useCallback((command: 'playVideo' | 'pauseVideo') => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command }),
      '*'
    );
  }, []);

  const handleWithMusic = useCallback(() => {
    setMusicModal(false);
    setWithMusic(true);
    setIsPlaying(true);
    setCardVisible(true);
    sendPlayerCommand('playVideo');
  }, [sendPlayerCommand]);

  const handleWithoutMusic = useCallback(() => {
    setMusicModal(false);
    setWithMusic(false);
    setIsPlaying(false);
    setCardVisible(true);
  }, []);

  const handleTogglePlay = useCallback(() => {
    const next = !isPlaying;
    setIsPlaying(next);
    sendPlayerCommand(next ? 'playVideo' : 'pauseVideo');
  }, [isPlaying, sendPlayerCommand]);

  // 만료된 엽서 분기
  if (expired || !postcard) {
    return <ExpiredCard />;
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{
        background: 'radial-gradient(circle at 50% 30%, #222536 0%, #151620 60%, #0E0F17 100%)',
      }}
    >
      {/* 이미지 색조 앰비언트 후광 (Ambient Blur Glow) */}
      <div
        className="absolute inset-0 scale-125 origin-center pointer-events-none"
        style={{
          backgroundImage: `url(${postcard.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(70px) saturate(1.5) brightness(0.8) opacity(0.45)',
        }}
      />

      {/* 유튜브 숨김 오디오 플레이어 (1×1px, autoplay 활성화) */}
      {postcard.youtube_id && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${postcard.youtube_id}?enablejsapi=1&autoplay=0&controls=0&loop=1`}
          allow="autoplay"
          style={{ width: 1, height: 1, position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          title="BGM Player"
        />
      )}

      <div
        className="relative z-10 min-h-screen flex flex-col"
        style={{
          opacity: cardVisible ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        {/* 상단 바 & 남은 시간 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-5">
          <Link
            href="/postcard"
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 shadow-sm transition-transform active:scale-95"
            id="postcard-view-back"
          >
            <ChevronLeft size={18} className="text-white/80" />
          </Link>
          
          <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-sm flex items-center gap-1.5">
            <span className="text-xs font-medium text-white/90">⏱ {timeRemaining}</span>
          </div>

          <div className="w-9" />
        </div>

        {/* 3D 엽서 캔버스 */}
        <Postcard3DCanvas postcard={postcard} visible={cardVisible} captureRef={captureRef} />

        {/* 오디오 플레이어 바 (BGM이 있고 음악 선택한 경우) */}
        {withMusic && postcard.youtube_id && (
          <AudioPlayerBar
            youtubeId={postcard.youtube_id}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
          />
        )}

        {/* 이미지 저장 버튼 */}
        <div className="w-full px-5 mt-6 flex justify-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            id="postcard-view-download"
            className="w-full max-w-[390px] py-3.5 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-60 shadow-lg"
            style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }}
          >
            <Download size={16} />
            {downloading ? SHARE_MESSAGES.DOWNLOADING : SHARE_MESSAGES.DOWNLOAD_DEFAULT}
          </button>
        </div>

        <div className="w-full px-5 mt-4 mb-4 flex justify-center">
          <div className="w-full max-w-[390px] px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg flex items-center justify-between">
            <span
              className="text-xs text-white/80"
              style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
            >
              나도 하루엽서 만들러 가기 →
            </span>
            <Link
              href="/postcard"
              className="text-xs px-3.5 py-1.5 rounded-full text-white hover:text-white font-medium shadow-md transition-transform active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7C5CE7 0%, #6C5CE7 100%)' }}
              id="postcard-view-viral"
            >
              만들기
            </Link>
          </div>
        </div>

        {/* Adfit AD Banner */}
        <div className="w-full px-5 mb-8 flex justify-center">
          <div className="w-full max-w-[390px] flex justify-center bg-white/5 rounded-2xl overflow-hidden backdrop-blur-md border border-white/10 p-3 shadow-lg">
            <KakaoAdfit 
              unit={process.env.NEXT_PUBLIC_ADFIT_UNIT_ID || ADFIT_UNITS.MAIN_BANNER} 
              {...ADFIT_SIZES.BANNER_320x100} 
            />
          </div>
        </div>
      </div>

      {/* 오디오 동의 모달 (1단계) */}
      {musicModal && (
        <AudioConsentModal
          youtubeId={postcard.youtube_id}
          onWithMusic={handleWithMusic}
          onWithoutMusic={handleWithoutMusic}
        />
      )}
    </div>
  );
}
