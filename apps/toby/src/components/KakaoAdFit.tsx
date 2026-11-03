import { useEffect, useRef } from 'react';

interface KakaoAdfitProps {
    unit?: string;
    width?: number;
    height?: number;
    className?: string;
}

export default function KakaoAdfit({
    unit = ADFIT_UNITS.TOBY_BANNER,
    width = ADFIT_SIZES.BANNER_320x100.width,
    height = ADFIT_SIZES.BANNER_320x100.height,
    className
}: KakaoAdfitProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = '';

        // Render AdFit in the page document rather than an isolated iframe.
        // Kakao's loader discovers ins.kakao_ad_area in the current document.
        const ins = document.createElement('ins');
        ins.className = 'kakao_ad_area';
        ins.style.display = 'none';
        ins.setAttribute('data-ad-unit', unit);
        ins.setAttribute('data-ad-width', String(width));
        ins.setAttribute('data-ad-height', String(height));
        container.appendChild(ins);

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://t1.kakaocdn.net/kas/static/ba.min.js';
        script.async = true;
        container.appendChild(script);

        return () => {
            container.innerHTML = '';
        };
    }, [unit, width, height]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                margin: '0 auto',
                overflow: 'hidden',
                maxWidth: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        />
    );
}

// 기본 배너 크기 상수
export const ADFIT_SIZES = {
    BANNER_320x100: { width: 320, height: 100 },
    BANNER_300x250: { width: 300, height: 250 },
    BANNER_320x50: { width: 320, height: 50 },
    BANNER_728x90: { width: 728, height: 90 },
} as const;

export const ADFIT_UNITS = {
    MAIN_BANNER: 'DAN-3vC1efIl2P6hH2DY',
    TOBY_BANNER: 'DAN-3vC1efIl2P6hH2DY',
} as const;
