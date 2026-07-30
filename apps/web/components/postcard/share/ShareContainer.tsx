'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Link2, Copy, Download, Mail } from 'lucide-react';
import { toPng } from 'html-to-image';
import { getFilterCss, getFontStyle } from '@/constants/postcard';
import { shareViaKakao, copyToClipboard, buildShareUrl } from '@/utils/kakaoShare';
import type { PostcardViewData } from '@/types/postcard';
import PostcardEffectOverlay from '../create/PostcardEffectOverlay';

import KakaoAdfit, { ADFIT_SIZES, ADFIT_UNITS } from '@/components/ads/kakao-adfit';

interface ShareContainerProps {
  postcard: PostcardViewData;
}

/**
 * 공유 완료 페이지 컨테이너
 * - 광고 모달로 시작하여 배경 블러 처리 (광고 확인 UX 유도)
 * - TTL 기반 디데이 카운트다운 표시
 * - 카카오톡 공유, 클립보드 복사, 이미지 다운로드
 */
export default function ShareContainer({ postcard }: ShareContainerProps) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);

  const shareUrl = buildShareUrl(postcard.id);

  /** 만료까지 남은 시간 계산 */
  const getTimeRemaining = useCallback(() => {
    const expiresAt = new Date(postcard.expires_at).getTime();
    const diff = expiresAt - Date.now();
    if (diff <= 0) return '만료됨';
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${hours}시간 ${minutes}분 후 사라짐`;
  }, [postcard.expires_at]);

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining);

  // 마운트 시 세션스토리지 조회하여 모달 표시 여부 결정
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const viewedList = sessionStorage.getItem('viewed_postcards');
        if (viewedList) {
          const ids = JSON.parse(viewedList);
          if (Array.isArray(ids) && ids.includes(postcard.id)) {
            setAdCountdown(0);
            return;
          }
        }
      } catch {
        // ignore
      }
    }
    setShowAdModal(true);
  }, [postcard.id]);

  // 1분마다 남은 시간 갱신
  useEffect(() => {
    const timer = setInterval(() => setTimeRemaining(getTimeRemaining()), 60_000);
    return () => clearInterval(timer);
  }, [getTimeRemaining]);

  // 광고 모달 카운트다운 타이머 (5초 후 자동 닫힘)
  useEffect(() => {
    if (!showAdModal) return;
    if (adCountdown <= 0) {
      setShowAdModal(false);
      if (typeof window !== 'undefined') {
        try {
          const viewedList = sessionStorage.getItem('viewed_postcards');
          const ids = viewedList ? JSON.parse(viewedList) : [];
          if (Array.isArray(ids)) {
            if (!ids.includes(postcard.id)) {
              ids.push(postcard.id);
              sessionStorage.setItem('viewed_postcards', JSON.stringify(ids));
            }
          } else {
            sessionStorage.setItem('viewed_postcards', JSON.stringify([postcard.id]));
          }
        } catch {
          // ignore
        }
      }
      return;
    }

    const timer = setInterval(() => {
      setAdCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showAdModal, adCountdown, postcard.id]);

  const handleKakaoShare = useCallback(() => {
    shareViaKakao({
      postcardId: postcard.id,
      message: postcard.message,
      imageUrl: postcard.image_url,
    });
  }, [postcard]);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }, [shareUrl]);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `haroo-postcard-${postcard.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert('이미지 저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setDownloading(false);
    }
  }, [postcard.id, downloading]);



  return (
    <div className="min-h-screen bg-background relative">
      {/* 1. 카카오 애드핏 광고 팝업 모달 */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-[340px] bg-white dark:bg-zinc-900 border border-border/80 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center shadow-inner">
              <Mail className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                엽서를 만드는 중...
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                잠시만 기다려주시면 엽서가 공개됩니다. ({adCountdown}초)
              </p>
            </div>

              <div className="w-full flex justify-center py-1">
                <KakaoAdfit
                  unit={process.env.NEXT_PUBLIC_ADFIT_UNIT_ID || ADFIT_UNITS.MAIN_BANNER}
                  width={320}
                  height={100}
                />
              </div>
            </div>
          </div>
        )}

      {/* 2. 메인 공유 페이지 콘텐츠 (모달 열림 시 블러 처리) */}
      <div className={`min-h-screen pb-10 transition-all duration-500 ${showAdModal ? 'filter blur-md pointer-events-none select-none' : ''}`}>
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
          <div
            className="text-center py-5"
            style={{ animation: 'fadeInUp 0.6s ease both' }}
          >
            <p className="text-sm text-muted-foreground">링크가 생성되었습니다.</p>
            <p className="text-xs text-primary mt-0.5 font-medium">
              ⏱ {timeRemaining}
            </p>
          </div>

          {/* 엽서 프리뷰 (이미지 다운로드 캡처 대상) */}
          <div
            className="flex justify-center mb-6"
            style={{ animation: 'fadeInUp 0.7s 0.1s ease both' }}
          >
            <div
              ref={previewRef}
              className="w-[240px] rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
              style={{ aspectRatio: '3/4' }}
              onClick={() => router.push(`/postcard/view/${postcard.id}`)}
              role="button"
              aria-label="엽서 열어보기"
            >
              <div className="w-full h-full relative">
                <div className="w-full relative overflow-hidden" style={{ height: '65%' }}>
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
                <div
                  className="p-4 bg-card flex flex-col justify-center"
                  style={{ height: '35%' }}
                >
                  <p
                    className="text-xs leading-relaxed whitespace-pre-line text-foreground/80"
                    style={getFontStyle(postcard.font_family)}
                  >
                    {postcard.message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 공유 링크 표시 */}
          <div
            className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl mb-5 text-[11px] text-muted-foreground"
            style={{ animation: 'fadeIn 0.6s 0.2s ease both' }}
          >
            <Link2 size={13} className="flex-shrink-0" />
            <span className="flex-1 truncate">{shareUrl}</span>
          </div>

          {/* 공유 액션 버튼 그룹 */}
          <div
            className="flex flex-col gap-2.5"
            style={{ animation: 'fadeInUp 0.6s 0.3s ease both' }}
          >
            {/* 카카오톡 공유 */}
            <button
              onClick={handleKakaoShare}
              id="postcard-share-kakao"
              className="w-full py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
              style={{ background: '#FAE100', color: '#3A1D1D' }}
            >
              <span className="text-base">💬</span>
              카카오톡 공유
            </button>

            {/* 링크 복사 */}
            <button
              onClick={handleCopy}
              id="postcard-share-copy"
              className="w-full py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-border transition-transform active:scale-[0.98]"
            >
              <Copy size={15} />
              {copied ? '복사됨 ✓' : '링크 복사'}
            </button>

            {/* 이미지 다운로드 */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              id="postcard-share-download"
              className="w-full py-4 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 bg-muted text-muted-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              <Download size={15} />
              {downloading ? '저장 중…' : '이미지 다운로드'}
            </button>
          </div>

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
            엽서 직접 보기 →
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
