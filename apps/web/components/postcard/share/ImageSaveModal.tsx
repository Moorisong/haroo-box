'use client';

import React from 'react';
import { X, Download, AlertCircle } from 'lucide-react';

interface ImageSaveModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

/**
 * 카카오톡/네이버 인앱 브라우저 다운로드 제한 대비 팝업 모달
 * - 완성된 PNG 이미지를 <img> 태그로 렌더링
 * - "이미지를 1초간 꾹 누르면 사진 앨범/갤러리에 저장돼요" 안내 제공
 */
export default function ImageSaveModal({ isOpen, imageUrl, onClose }: ImageSaveModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-[360px] bg-[#1C1D2A] rounded-3xl p-5 border border-white/10 shadow-2xl flex flex-col items-center">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
          aria-label="닫기"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-3 self-start px-1">
          <AlertCircle size={15} />
          <span>카카오톡 인앱 저장 안내</span>
        </div>

        {/* 캡처 이미지 렌더링 */}
        <div className="w-full rounded-2xl overflow-hidden shadow-lg mb-4 border border-white/10 bg-black/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="완성된 하루엽서"
            className="w-full h-auto object-contain select-all"
          />
        </div>

        {/* 유저 조작 가이드 */}
        <div className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-center mb-4">
          <p className="text-xs text-white/90 font-medium leading-relaxed">
            👆 위 이미지를 <span className="text-amber-300 font-bold underline">1초간 길게 누르면</span>
          </p>
          <p className="text-xs text-white/70 mt-0.5">
            기본 카메라 앨범/갤러리에 바로 저장할 수 있어요!
          </p>
        </div>

        {/* 확인/닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow-md active:scale-95 transition-transform"
        >
          확인했습니다
        </button>
      </div>
    </div>
  );
}
