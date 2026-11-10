'use client';
import { useLanguage } from '@/components/providers/language-provider';

import { useState } from 'react';
import Button from '@/components/ui/button';
import { useToast } from '@/lib/hooks/use-toast';

export default function SNSBrowserFallback() {
  const { t } = useLanguage();
    const { showToast } = useToast();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            showToast(t('puzzle.components.puzzle.sns.browser.fallback.001'), 'success');
        } catch (err) {
            showToast(t('puzzle.components.puzzle.sns.browser.fallback.002'), 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col justify-center items-center p-6 text-center text-white">
            <h1 className="text-2xl font-bold mb-4">{t('puzzle.components.puzzle.sns.browser.fallback.003')}<br/>{t('puzzle.components.puzzle.sns.browser.fallback.004')}</h1>
            <p className="text-gray-300 mb-8 whitespace-pre-line leading-relaxed">
                {t('puzzle.components.puzzle.sns.browser.fallback.005')} {'\n'}
                {t('puzzle.components.puzzle.sns.browser.fallback.006')} {'\n'}
                {t('puzzle.components.puzzle.sns.browser.fallback.007')} {'\n'}
                <strong className="text-white">{t('puzzle.components.puzzle.sns.browser.fallback.008')}</strong>{t('puzzle.components.puzzle.sns.browser.fallback.009')}
            </p>
            <Button
                variant="primary"
                onClick={handleCopyLink}
                className="w-full max-w-sm mb-4"
            >
                {isCopied ? t('puzzle.components.puzzle.sns.browser.fallback.010') : t('puzzle.components.puzzle.sns.browser.fallback.011')}
            </Button>
            <p className="text-sm text-gray-500">
                {t('puzzle.components.puzzle.sns.browser.fallback.012')} {'\n'}
                {t('puzzle.components.puzzle.sns.browser.fallback.013')}
            </p>
        </div>
    );
}
