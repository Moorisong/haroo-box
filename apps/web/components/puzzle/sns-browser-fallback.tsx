'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import { useToast } from '@/lib/hooks/use-toast';

export default function SNSBrowserFallback() {
    const { showToast } = useToast();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            showToast('링크가 복사되었습니다! 기본 브라우저에 붙여넣어 주세요.', 'success');
        } catch (err) {
            showToast('링크 복사에 실패했습니다.', 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col justify-center items-center p-6 text-center text-white">
            <h1 className="text-2xl font-bold mb-4">원활한 플레이를 위해<br/>기본 브라우저로 이동해주세요!</h1>
            <p className="text-gray-300 mb-8 whitespace-pre-line leading-relaxed">
                현재 사용 중인 브라우저에서는{'\n'}
                퍼즐 화면이 좁아져 정상적인 플레이가 어렵습니다.{'\n'}
                아래 버튼을 눌러 링크를 복사한 뒤,{'\n'}
                <strong className="text-white">사파리나 크롬</strong>에서 열어주세요.
            </p>
            <Button
                variant="primary"
                onClick={handleCopyLink}
                className="w-full max-w-sm mb-4"
            >
                {isCopied ? '복사 완료!' : '링크 복사하기'}
            </Button>
            <p className="text-sm text-gray-500">
                또는 화면 우측 상단의 [더보기] 메뉴를 눌러{'\n'}
                '다른 브라우저로 열기'를 선택해 주세요.
            </p>
        </div>
    );
}
