'use client';
import { useLanguage } from '@/components/providers/language-provider';
import { puzzleTitle } from '@/lib/puzzle-i18n';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Trophy, Clock, Users, Calendar } from 'lucide-react';
import { fetchCurrentPuzzle, fetchCurrentRankings, fetchMyRanking } from '@/lib/puzzle-api';
import { Puzzle, RankingEntry, MyRanking } from '@/types/puzzle';
import RankingTable from '@/components/puzzle/ranking-table';
import MyRankingCard from '@/components/puzzle/my-ranking-card';
import PercentileChart from '@/components/puzzle/percentile-chart';
import Link from 'next/link';
import styles from '../puzzle-layout.module.css';
import KakaoAdfit, { ADFIT_SIZES, ADFIT_UNITS } from '@/components/ads/kakao-adfit';

export default function RankingPage() {
  const { language, t } = useLanguage();
  const { data: session } = useSession();
  const token = session?.user?.kakaoId;

  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [myRanking, setMyRanking] = useState<MyRanking | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'novice' | 'beginner' | 'expert'>('novice');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    async function loadRankings() {
      setIsLoading(true);
      setVisibleCount(20);
      try {
        // 1. 현재 활성 퍼즐 조회
        const res = await fetchCurrentPuzzle();
        if (res.success && res.data) {
          setCurrentPuzzle(res.data);
          const pId = res.data._id;

          // 2. 전체 랭킹 조회 (난이도에 맞춤)
          const rankRes = await fetchCurrentRankings(pId, selectedDifficulty);
          if (rankRes.success && rankRes.data) {
            setRankings(rankRes.data);
          } else {
            setRankings([]);
          }

          // 3. 내 랭킹 조회 (로그인 시, 난이도에 맞춤)
          if (token) {
            const myRankRes = await fetchMyRanking(pId, token, selectedDifficulty);
            if (myRankRes.success && myRankRes.data) {
              setMyRanking(myRankRes.data);
            } else {
              setMyRanking(null);
            }
          } else {
            setMyRanking(null);
          }
        }
      } catch (e) {
        console.error('Failed to load ranking details:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadRankings();
  }, [token, selectedDifficulty]);

  const handleScrollToMyRank = () => {
    if (!myRanking || myRanking.myRank === null) return;
    
    // 1. Ensure the user's rank is visible in the list
    if (myRanking.myRank > visibleCount) {
      setVisibleCount(myRanking.myRank);
    }
    
    // 2. Wait for the list to render, then scroll to the row
    setTimeout(() => {
      const element = document.getElementById('my-ranking-row');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const getDaysLeft = (endDateStr: string) => {
    try {
      const end = new Date(endDateStr).getTime();
      const diff = end - Date.now();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? `${days} ${t('일 남음', 'days left')}` : t('종료 임박', 'Ending soon');
    } catch {
      return '';
    }
  };

  const getFormatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return language === 'en' ? `Week ${Math.ceil(date.getDate() / 7)} · ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)}` : `${date.getMonth() + 1}월 ${Math.ceil(date.getDate() / 7)}주차`;
    } catch {
      return t('주간 대회', 'Weekly challenge');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] flex-col gap-3 font-semibold">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--puzzle-primary) var(--puzzle-primary) var(--puzzle-primary) transparent' }} />
        <span style={{ color: 'var(--puzzle-muted-foreground)' }}>{t('주간 랭킹 보드를 동기화하는 중...', 'Loading weekly rankings...')}</span>
      </div>
    );
  }

  if (!currentPuzzle) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] flex-col gap-2 select-none">
        <span className="text-3xl">🏆</span>
        <p className="text-sm font-bold" style={{ color: 'var(--puzzle-muted-foreground)' }}>{t('현재 등록된 주간 랭킹 이벤트가 없습니다.', 'No weekly ranking event is available.')}</p>
        <Link href="/puzzle" className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold shadow hover:bg-blue-600 transition-all">{t('메인 페이지', 'Home')}</Link>
      </div>
    );
  }

  return (
    <div className={`${styles.container} puzzle-animate-fade-in-up`}>
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2 mb-1.5" style={{ color: 'var(--puzzle-card-foreground)' }}>
            <Trophy size={28} style={{ color: '#F59E0B' }} />
            {t('주간 랭킹 경쟁', 'Weekly leaderboard')}
          </h1>
          <p className="text-sm font-semibold" style={{ color: 'var(--puzzle-muted-foreground)' }}>
            {getFormatDate(currentPuzzle.startDate)} · {puzzleTitle(currentPuzzle, language)}
          </p>
        </div>

        {/* Premium difficulty pills */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-2xl border w-full md:w-auto" style={{ borderColor: 'var(--puzzle-border)' }}>
          <button
            onClick={() => setSelectedDifficulty('novice')}
            className="flex-1 md:flex-initial px-3 sm:px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 text-center"
            style={{
              backgroundColor: selectedDifficulty === 'novice' ? 'var(--puzzle-primary)' : 'transparent',
              color: selectedDifficulty === 'novice' ? '#fff' : 'var(--puzzle-muted-foreground)',
              boxShadow: selectedDifficulty === 'novice' ? 'var(--puzzle-shadow-sm)' : 'none',
            }}
          >
            {t('초보', 'Easy')}
            <span className="block sm:inline sm:ml-1 text-[10px] sm:text-xs opacity-80">(36 {t('조각', 'pieces')})</span>
          </button>
          <button
            onClick={() => setSelectedDifficulty('beginner')}
            className="flex-1 md:flex-initial px-3 sm:px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 text-center"
            style={{
              backgroundColor: selectedDifficulty === 'beginner' ? 'var(--puzzle-primary)' : 'transparent',
              color: selectedDifficulty === 'beginner' ? '#fff' : 'var(--puzzle-muted-foreground)',
              boxShadow: selectedDifficulty === 'beginner' ? 'var(--puzzle-shadow-sm)' : 'none',
            }}
          >
            {t('일반', 'Normal')}
            <span className="block sm:inline sm:ml-1 text-[10px] sm:text-xs opacity-80">(100 {t('조각', 'pieces')})</span>
          </button>
          <button
            onClick={() => setSelectedDifficulty('expert')}
            className="flex-1 md:flex-initial px-3 sm:px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 text-center"
            style={{
              backgroundColor: selectedDifficulty === 'expert' ? 'var(--puzzle-primary)' : 'transparent',
              color: selectedDifficulty === 'expert' ? '#fff' : 'var(--puzzle-muted-foreground)',
              boxShadow: selectedDifficulty === 'expert' ? 'var(--puzzle-shadow-sm)' : 'none',
            }}
          >
            {t('고수', 'Expert')}
            <span className="block sm:inline sm:ml-1 text-[10px] sm:text-xs opacity-80">(256 {t('조각', 'pieces')})</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Preview Banner + Leaderboard) */}
        <div className="lg:col-span-2 contents lg:flex lg:flex-col lg:gap-5">
          {/* Puzzle Info Preview Banner */}
          <div className="order-2 lg:order-none">
            <Link
              href="/puzzle"
              className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-4 rounded-2xl border overflow-hidden transition-all duration-200 group"
              style={{ 
                backgroundColor: 'var(--puzzle-glass-bg)', 
                backdropFilter: 'var(--puzzle-glass-blur)',
                borderColor: 'var(--puzzle-border)',
                boxShadow: 'var(--puzzle-shadow-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--puzzle-primary)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--puzzle-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <img
                src={currentPuzzle.imageUrl}
                alt={puzzleTitle(currentPuzzle, language)}
                className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded-xl flex-shrink-0 border transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ borderColor: 'var(--puzzle-border)' }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="truncate mb-1 text-sm font-extrabold transition-colors duration-200 group-hover:text-[var(--puzzle-primary)]"
                  style={{ color: 'var(--puzzle-card-foreground)' }}
                >
                  {puzzleTitle(currentPuzzle, language)}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: 'var(--puzzle-muted-foreground)' }}>
                    <Users size={11} /> {currentPuzzle.participantCount.toLocaleString()} {t('명 완주', 'completed')}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: 'var(--puzzle-muted-foreground)' }}>
                    <Clock size={11} /> {getDaysLeft(currentPuzzle.endDate)}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold hidden sm:flex" style={{ color: 'var(--puzzle-muted-foreground)' }}>
                    <Trophy size={11} /> {selectedDifficulty === 'novice' ? `${t('초보 난이도', 'Easy')} (36 ${t('조각', 'pieces')})` : selectedDifficulty === 'beginner' ? `${t('일반 난이도', 'Normal')} (100 ${t('조각', 'pieces')})` : `${t('고수 난이도', 'Expert')} (256 ${t('조각', 'pieces')})`}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Leaderboard Table */}
          <div className="order-3 lg:order-none flex flex-col gap-5">
            <RankingTable
              rankings={rankings.slice(0, visibleCount)}
              myNickname={session?.user?.nickname || session?.user?.name || undefined}
              totalParticipants={rankings.length}
              hasMore={rankings.length > visibleCount}
              onShowMore={() => setVisibleCount((prev) => prev + 20)}
            />
          </div>

          {/* Adfit AD Banner on Mobile (Below Leaderboard) */}
          <div className="order-3 lg:order-none block lg:hidden my-4 flex justify-center">
            <KakaoAdfit unit={ADFIT_UNITS.PUZZLE_BANNER} {...ADFIT_SIZES.BANNER_320x100} />
          </div>
        </div>

        {/* Right Column (My Ranking + Percentile Chart) */}
        <div className="lg:col-span-1 contents lg:flex lg:flex-col lg:gap-4">
          {/* 1. 내 최고 기록 (MyRankingCard) */}
          <div className="order-1 lg:order-none">
            <MyRankingCard
              myRanking={myRanking}
              isLoggedIn={!!token}
              onRankClick={handleScrollToMyRank}
            />
          </div>

          {/* 3. 성적 분포 분석 (PercentileChart) */}
          <div className="order-4 lg:order-none">
            <PercentileChart
              topPercent={myRanking ? myRanking.topPercent : null}
              totalParticipants={myRanking ? myRanking.totalParticipants : 0}
              myRank={myRanking ? myRanking.myRank : null}
            />
          </div>

          {/* Adfit AD Banner on PC (Below Percentile Chart - changed to 320x100 to reduce height) */}
          <div className="order-4 lg:order-none hidden lg:block flex justify-center">
            <KakaoAdfit unit={ADFIT_UNITS.PUZZLE_BANNER} {...ADFIT_SIZES.BANNER_320x100} />
          </div>
        </div>
      </div>
    </div>
  );
}
