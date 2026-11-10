import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { fetchCurrentPuzzle } from '@/lib/puzzle-api';
import { API_BASE_URL } from '@/constants';
import { puzzleTitle } from '@/lib/puzzle-i18n';
import PuzzlePageClient from './page.client';

type Locale = 'ko' | 'en';

async function getPuzzleMetadataTranslations(locale: Locale): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/puzzle/translations?lang=${locale}`, { cache: 'no-store' });
    if (!response.ok) return {};
    const json = await response.json();
    return json.success && json.locale === locale && json.data ? json.data : {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const preferred = cookieStore.get('haroo-language')?.value;
  const locale: Locale = preferred === 'ko' || preferred === 'en'
    ? preferred
    : headerStore.get('accept-language')?.toLowerCase().startsWith('ko') ? 'ko' : 'en';
  const [translations, current] = await Promise.all([
    getPuzzleMetadataTranslations(locale),
    fetchCurrentPuzzle(),
  ]);
  const pageTitle = translations['puzzle.metadata.pageTitle'] || '';
  const description = translations['puzzle.metadata.description'] || '';
  const shareTitle = translations['puzzle.metadata.shareTitle'] || '';
  const puzzle = current.success ? current.data : undefined;
  if (!puzzle) return { title: { absolute: pageTitle }, description };

  const imageUrl = puzzle.imageUrl.startsWith('http')
    ? puzzle.imageUrl
    : `https://box.harooo.co.kr${puzzle.imageUrl}`;
  return {
    title: { absolute: pageTitle },
    description,
    openGraph: {
      title: shareTitle,
      description,
      url: 'https://box.harooo.co.kr/puzzle',
      type: 'website',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: puzzleTitle(puzzle, locale, translations['puzzle.metadata.untranslated_title'] || ''),
      }],
    },
    twitter: { card: 'summary_large_image', title: shareTitle, description, images: [imageUrl] },
  };
}

export default function PuzzlePage() {
  return <PuzzlePageClient />;
}
