'use client';

import React, { useRef, useCallback } from 'react';
import { POSTCARD_FILTERS, POSTCARD_EFFECTS } from '@/constants/postcard';
import { usePostcardFormStore } from '@/store/usePostcardFormStore';
import type { PostcardFilterType, PostcardEffectType } from '@/types/postcard';

/**
 * Step 1: 사진 업로드 & 필터 선택
 */
export default function StepUpload() {
  const {
    filterType,
    filterIntensity,
    effectType,
    setFilterType,
    setFilterIntensity,
    setEffectType,
  } = usePostcardFormStore();

  const handleFilterSelect = useCallback(
    (id: PostcardFilterType) => setFilterType(id),
    [setFilterType]
  );

  const handleEffectSelect = useCallback(
    (id: PostcardEffectType) => setEffectType(id),
    [setEffectType]
  );

  return (
    <section
      className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4"
      style={{ fontFamily: "'Nanum Gothic', sans-serif" }}
    >


      {/* 필터 선택 영역 (8종 필터 + 강도 조절 프로그레스 바만 표시) */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground block">
          필터 선택
        </label>

        {/* 8종 필터 그리드 */}
        <div className="grid grid-cols-4 gap-2">
          {POSTCARD_FILTERS.map((f) => {
            const isSelected = filterType === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFilterSelect(f.id)}
                id={`postcard-filter-${f.id}`}
                className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all text-center border flex items-center justify-center cursor-pointer select-none truncate ${
                  isSelected
                    ? '!bg-blue-500/10 !text-blue-600 border-blue-500 shadow-xs scale-[1.02]'
                    : 'bg-muted/30 text-muted-foreground border-border/80 hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <span>{f.name}</span>
              </button>
            );
          })}
        </div>

        {/* 필터 강도 조절 최소한의 미니멀 UX (필터 선택 시 표시) */}
        {filterType !== 'none' && (
          <div className="pt-1.5 px-0.5 space-y-1 animate-fadeIn">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>필터 농도</span>
              <span className="font-semibold text-blue-600">{filterIntensity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={filterIntensity}
              onChange={(e) => setFilterIntensity(Number(e.target.value))}
              className="w-full h-1.5 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        )}
      </div>

      {/* 배경 감성 이펙트 선택 영역 (8종) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground block">
          배경 이펙트 효과 <span className="text-[10px] font-normal text-muted-foreground">(선택)</span>
        </label>

        <div className="grid grid-cols-4 gap-2">
          {POSTCARD_EFFECTS.map((eff) => {
            const isSelected = effectType === eff.id;
            return (
              <button
                key={eff.id}
                type="button"
                onClick={() => handleEffectSelect(eff.id)}
                id={`postcard-effect-${eff.id}`}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center border flex items-center justify-center cursor-pointer select-none truncate ${
                  isSelected
                    ? '!bg-blue-500/10 !text-blue-600 border-blue-500 shadow-xs scale-[1.02]'
                    : 'bg-muted/30 text-muted-foreground border-border/80 hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <span>{eff.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
