'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/providers/language-provider';
import { Share2, Link2, Check } from 'lucide-react';
import { Puzzle } from '@/types/puzzle';

interface ShareCardProps {
  puzzle: Puzzle;
}

export default function ShareCard({ puzzle }: ShareCardProps) {
  const { language, t } = useLanguage();
  const { data: session } = useSession();
  const useKakaoShare = language === 'ko' && (!session || session.user?.provider === 'kakao' || (!session.user?.provider && !!session.user?.kakaoId));
  const [isCopied, setIsCopied] = useState(false);

  const getAbsoluteImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // 상대 경로 이미지인 경우 도메인을 붙여 절대 경로로 변환 (카카오 연동 필수 조건)
    return window.location.origin + url;
  };

  const handleShare = async () => {
    if (!useKakaoShare) {
      const data = { title: t('하루퍼즐', 'Haroo Puzzle'), text: t('이번 주 퍼즐을 함께 맞춰요!', 'Try this week’s puzzle!'), url: window.location.origin + '/puzzle' };
      if (navigator.share) {
        try { await navigator.share(data); return; } catch (error) { if ((error as Error).name === 'AbortError') return; }
      }
      await handleCopyLink();
      return;
    }
    if (typeof window !== 'undefined') {
      const Kakao = (window as any).Kakao;
      
      // Kakao SDK가 로드되었는지 확인
      if (Kakao) {
        // 초기화가 안 되어 있다면 명시적으로 초기화 수행
        if (Kakao.isInitialized && !Kakao.isInitialized()) {
          Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
        }
        
        // 초기화 성공 시 공유 실행
        if (Kakao.isInitialized && Kakao.isInitialized()) {
          try {
            const absImgUrl = getAbsoluteImageUrl(puzzle.imageUrl);
            Kakao.Share.sendDefault({
              objectType: 'feed',
              content: {
                title: `[하루퍼즐] 이번 주 퍼즐 도착!`,
                description: `바쁜 일상 속 소소한 퍼즐 한 조각 어떠세요? ☕`,
                imageUrl: absImgUrl,
                link: {
                  mobileWebUrl: window.location.origin + '/puzzle',
                  webUrl: window.location.origin + '/puzzle',
                },
              },
              buttons: [
                {
                  title: '함께 플레이하기',
                  link: {
                    mobileWebUrl: window.location.origin + '/puzzle',
                    webUrl: window.location.origin + '/puzzle',
                  },
                },
              ],
            });
            return;
          } catch (e) {
            console.error('Kakao share error:', e);
          }
        }
      }
      
      // Kakao SDK 로드 또는 실행 실패 시 안내
      await handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined') {
      try { await navigator.clipboard.writeText(window.location.origin + '/puzzle'); } catch { window.prompt(t('링크를 복사해 주세요', 'Copy this link'), window.location.origin + '/puzzle'); return; }
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col justify-between gap-4"
      style={{
        backgroundColor: 'var(--puzzle-glass-bg)',
        backdropFilter: 'var(--puzzle-glass-blur)',
        borderColor: 'var(--puzzle-border)',
        boxShadow: 'var(--puzzle-shadow-sm)',
        minHeight: '180px',
      }}
    >
      <div>
        <p className="text-sm font-extrabold" style={{ color: 'var(--puzzle-card-foreground)' }}>
          {t('친구에게 자랑하기', 'Share with friends')}
        </p>
        <p className="mt-1 text-xs font-semibold leading-relaxed" style={{ color: 'var(--puzzle-muted-foreground)' }}>
          {t('매주 갱신되는 퍼즐을 친구들과 함께 즐겨요.', 'A fresh puzzle every week. Invite your friends to play!')}
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-95 text-xs font-extrabold"
          style={{
            backgroundColor: useKakaoShare ? '#FEE500' : '#284cb0',
            color: useKakaoShare ? '#191919' : '#ffffff',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = useKakaoShare ? '#F5DC00' : '#1e3b90';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = useKakaoShare ? '#FEE500' : '#284cb0';
          }}
        >
          <Share2 size={13} strokeWidth={2.5} />
          {useKakaoShare ? t('카카오톡으로 공유', 'Share on KakaoTalk') : t('공유하기', 'Share')}
        </button>

        <button
          onClick={handleCopyLink}
          disabled={isCopied}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-200 hover:scale-[1.01] active:scale-95 text-xs font-extrabold disabled:pointer-events-none"
          style={{
            backgroundColor: isCopied ? 'var(--puzzle-secondary)' : 'var(--puzzle-glass-bg)',
            color: isCopied ? 'var(--puzzle-primary)' : 'var(--puzzle-foreground)',
            borderColor: isCopied ? 'var(--puzzle-primary)' : 'var(--puzzle-border)',
          }}
          onMouseEnter={(e) => {
            if (!isCopied) e.currentTarget.style.borderColor = 'var(--puzzle-primary)';
          }}
          onMouseLeave={(e) => {
            if (!isCopied) e.currentTarget.style.borderColor = 'var(--puzzle-border)';
          }}
        >
          {isCopied ? (
            <>
              <Check size={13} strokeWidth={2.5} style={{ color: 'var(--puzzle-primary)' }} />
              {t('링크 복사 완료', 'Link copied')}
            </>
          ) : (
            <>
              <Link2 size={13} strokeWidth={2.5} style={{ color: 'var(--puzzle-primary)' }} />
              {t('공유 링크 복사하기', 'Copy share link')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
