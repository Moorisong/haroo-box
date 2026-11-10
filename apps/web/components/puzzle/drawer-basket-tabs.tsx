'use client';
import React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { basketMetadata } from './piece-drawer-modal';

interface DrawerBasketTabsProps {
  activeBasket: string;
  setActiveBasket: (basket: string) => void;
  baskets: Record<string, number[]>;
  hoveredBasket: string | null;
  movePieceToBasket: (pieceId: number, targetBasket: string) => void;
  isOrganizeMode: boolean;
  selectedPieceId: number | null;
}

export function DrawerBasketTabs({
  activeBasket,
  setActiveBasket,
  baskets,
  hoveredBasket,
  movePieceToBasket,
  isOrganizeMode,
  selectedPieceId,
}: DrawerBasketTabsProps) {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-5 gap-2 p-4 border-b" style={{ borderColor: 'var(--puzzle-border)', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
      {['basket1', 'basket2', 'basket3', 'basket4', 'basket5'].map((key) => {
        const isActive = activeBasket === key;
        const isHovered = hoveredBasket === key;
        const count = baskets[key]?.length || 0;
        const meta = basketMetadata[key];

        return (
          <div
            key={key}
            data-basket-id={key}
            onClick={() => {
              if (isOrganizeMode && selectedPieceId !== null) movePieceToBasket(selectedPieceId, key);
              else setActiveBasket(key);
            }}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all cursor-pointer select-none gap-1"
            style={{
              borderColor: isHovered ? 'var(--puzzle-primary)' : isActive ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)',
              backgroundColor: isHovered ? 'rgba(59, 130, 246, 0.2)' : isActive ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: meta.color }} />
              <span className="text-[10px] font-black transition-colors" style={{ color: isActive || isHovered ? '#60a5fa' : '#94a3b8' }}>
                {key === 'basket1' ? t('빨강', 'Red') : key === 'basket2' ? t('파랑', 'Blue') : key === 'basket3' ? t('초록', 'Green') : key === 'basket4' ? t('노랑', 'Yellow') : t('보라', 'Purple')}
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-400">({count} {t('개', 'pcs')})</span>
          </div>
        );
      })}
    </div>
  );
}
