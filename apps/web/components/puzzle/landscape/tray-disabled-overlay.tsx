import { Lock } from 'lucide-react';

export function TrayDisabledOverlay() {
  return (
    <div className="absolute inset-0 bg-slate-50/70 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center p-4 text-center transition-all duration-300 animate-in fade-in">
      <div className="bg-white/95 p-5 rounded-2xl shadow-xl border border-slate-200/60 flex flex-col items-center gap-3 max-w-[85%]">
        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
          <Lock size={18} className="text-slate-600" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold text-slate-800">보관함 비활성화</p>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            이동 모드 해제 후 사용 가능
          </p>
        </div>
      </div>
    </div>
  );
}
