import type { Puzzle } from '@/types/puzzle';

/** Reviewed translations for legacy puzzles pending database backfill. */
const LEGACY_ENGLISH_TITLES: Record<string, string> = {
  '스팀펑크 황동 비행선과 석양의 시계탑': 'Steampunk Brass Airship and Clock Tower at Sunset',
};

/** English mode never falls back to untranslated Korean puzzle metadata. */
export function puzzleTitle(puzzle: Pick<Puzzle, 'title' | 'title_en' | 'week'>, language: 'ko' | 'en'): string {
  if (language === 'ko') return puzzle.title;
  const translated = puzzle.title_en?.trim() || LEGACY_ENGLISH_TITLES[puzzle.title];
  return translated && !/[가-힣]/.test(translated) ? translated : `Puzzle · Week ${puzzle.week}`;
}

export function puzzleDescription(puzzle: Pick<Puzzle, 'description' | 'description_en'>, language: 'ko' | 'en'): string {
  if (language === 'ko') return puzzle.description ?? '';
  const translated = puzzle.description_en?.trim();
  return translated && !/[가-힣]/.test(translated) ? translated : '';
}
