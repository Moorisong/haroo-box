'use client';
import { useLanguage } from '@/components/providers/language-provider';

import { ZoomIn, ZoomOut, Shuffle, Save, Check } from 'lucide-react';

export type InteractionMode = 'play' | 'move';

interface LandscapeToolbarProps {
  interactionMode?: InteractionMode;
  onModeChange?: (mode: InteractionMode) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onShuffle: () => void;
  onSave: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved';
  timerFormatted: string;
  progressPercent: number;
  puzzleTitle: string;
  difficulty: string;
}

export default function LandscapeToolbar({
  interactionMode = 'play',
  onModeChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onShuffle,
  onSave,
  saveStatus = 'idle',
  timerFormatted,
  progressPercent,
  puzzleTitle,
  difficulty,
}: LandscapeToolbarProps) {
  const { t } = useLanguage();
  const roundedZoom = Math.round(zoom * 10) / 10;

  return (
    <div
      className="flex items-center justify-between px-6 py-2.5 border-b select-none"
      style={{
        backgroundColor: '#ffffff',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        minHeight: '56px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 왼쪽: 제목 + 난이도 */}
      <div className="flex flex-col min-w-0">
        <span
          className="text-sm font-bold tracking-tight text-gray-800 truncate max-w-[240px]"
        >
          {puzzleTitle}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs font-medium text-gray-500">
          <span>{difficulty}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-blue-600 font-semibold">{progressPercent}% {t('puzzle.components.puzzle.landscape.landscape.toolbar.001')}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="font-mono text-gray-600">⏱ {timerFormatted}</span>
        </div>
      </div>

      {/* 오른쪽: 확대/축소 + 판 엎기 + 저장 */}
      <div className="flex items-center gap-3">
        {/* 모드 선택 (플레이 / 이동) */}
        <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200/80 mr-1">
          <button
            onClick={() => onModeChange?.('play')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              interactionMode === 'play'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t('puzzle.components.puzzle.landscape.landscape.toolbar.002')}
          </button>
          <button
            onClick={() => onModeChange?.('move')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              interactionMode === 'move'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t('puzzle.components.puzzle.landscape.landscape.toolbar.003')}
          </button>
        </div>

        <div className="w-px h-3 mr-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />

        {/* 확대/축소 (극도로 절제된 디자인) */}
        <div className="flex items-center gap-1">
          <button
            onClick={onZoomOut}
            disabled={zoom <= 0.6}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 transition-all disabled:opacity-20 disabled:pointer-events-none"
            title={t('puzzle.components.puzzle.landscape.landscape.toolbar.004')}
          >
            <ZoomOut size={13} />
          </button>

          <span
            className="text-[10px] font-mono font-medium min-w-[28px] text-center text-gray-600"
          >
            {roundedZoom}x
          </span>

          <button
            onClick={onZoomIn}
            disabled={zoom >= 2.2}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 transition-all disabled:opacity-20 disabled:pointer-events-none"
            title={t('puzzle.components.puzzle.landscape.landscape.toolbar.005')}
          >
            <ZoomIn size={13} />
          </button>
        </div>

        <div className="w-px h-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />

        {/* 판 엎기 */}
        <button
          onClick={onShuffle}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
          title={t('puzzle.components.puzzle.landscape.landscape.toolbar.006')}
        >
          <Shuffle size={12} />
          <span className="hidden lg:inline text-[11px]">{t('puzzle.components.puzzle.landscape.landscape.toolbar.007')}</span>
        </button>

        <div className="w-px h-3 mx-0.5" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />

        {/* 저장/제출 */}
        <button
          onClick={onSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-150 disabled:opacity-70"
          style={{
            backgroundColor:
              saveStatus === 'saved'
                ? 'rgba(16, 185, 129, 0.1)'
                : saveStatus === 'saving'
                ? 'rgba(79, 142, 247, 0.1)'
                : '#4f8ef7',
            color: saveStatus === 'saved' ? '#10b981' : saveStatus === 'saving' ? '#4f8ef7' : '#fff',
            border: saveStatus === 'saved' ? '1px solid rgba(16, 185, 129, 0.2)' : saveStatus === 'saving' ? '1px solid rgba(79, 142, 247, 0.2)' : '1px solid transparent',
          }}
          title={t('puzzle.components.puzzle.landscape.landscape.toolbar.008')}
        >
          {saveStatus === 'saving' ? (
            <div className="w-3 h-3 border border-t-transparent border-current rounded-full animate-spin" />
          ) : saveStatus === 'saved' ? (
            <Check size={12} />
          ) : (
            <Save size={12} />
          )}
          <span className="hidden lg:inline text-[11px]">
            {saveStatus === 'saving' ? t('puzzle.components.puzzle.landscape.landscape.toolbar.009') : saveStatus === 'saved' ? t('puzzle.components.puzzle.landscape.landscape.toolbar.010') : t('puzzle.components.puzzle.landscape.landscape.toolbar.011')}
          </span>
        </button>
      </div>
    </div>
  );
}
