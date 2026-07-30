import React, { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import KakaoAdfit, { ADFIT_UNITS } from '@/components/ads/kakao-adfit';
import { SHARE_MESSAGES, AD_GATE_COUNTDOWN_SHARE_SEC } from '@/constants/postcard';

interface AdLoadingModalProps {
  postcardId: string;
  onComplete: () => void;
}

export default function AdLoadingModal({ postcardId, onComplete }: AdLoadingModalProps) {
  const [showAdModal, setShowAdModal] = useState(false);
  const [adCountdown, setAdCountdown] = useState(AD_GATE_COUNTDOWN_SHARE_SEC);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const viewedList = sessionStorage.getItem('viewed_postcards');
        if (viewedList) {
          const ids = JSON.parse(viewedList);
          if (Array.isArray(ids) && ids.includes(postcardId)) {
            setTimeout(() => {
              setAdCountdown(0);
              onComplete();
            }, 0);
            return;
          }
        }
      } catch {
        // ignore
      }
    }
    setTimeout(() => setShowAdModal(true), 0);
  }, [postcardId, onComplete]);

  useEffect(() => {
    if (!showAdModal) return;
    if (adCountdown <= 0) {
      setTimeout(() => {
        setShowAdModal(false);
        onComplete();
      }, 0);
      
      if (typeof window !== 'undefined') {
        try {
          const viewedList = sessionStorage.getItem('viewed_postcards');
          const ids = viewedList ? JSON.parse(viewedList) : [];
          if (Array.isArray(ids)) {
            if (!ids.includes(postcardId)) {
              ids.push(postcardId);
              sessionStorage.setItem('viewed_postcards', JSON.stringify(ids));
            }
          } else {
            sessionStorage.setItem('viewed_postcards', JSON.stringify([postcardId]));
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
  }, [showAdModal, adCountdown, postcardId, onComplete]);

  if (!showAdModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-[340px] bg-white dark:bg-zinc-900 border border-border/80 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center shadow-inner">
          <Mail className="w-7 h-7 text-amber-600 dark:text-amber-400" />
        </div>
        
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            {SHARE_MESSAGES.AD_TITLE}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {SHARE_MESSAGES.AD_DESC} ({adCountdown}초)
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
  );
}
