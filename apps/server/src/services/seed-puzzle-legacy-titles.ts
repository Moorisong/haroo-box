import translations from '../data/puzzle-legacy-title-translations.json';
import { getPuzzleModel } from '../models/puzzle.model';

/** One-time, non-destructive migration for verified legacy titles. */
export async function seedLegacyPuzzleTitles(): Promise<void> {
  const Puzzle = getPuzzleModel();
  for (const row of translations) {
    if (!row.title || !row.title_en || /[가-힣]/.test(row.title_en)) {
      throw new Error('Invalid legacy English title backfill');
    }
    await Puzzle.updateMany(
      { title: row.title, $or: [{ title_en: { $exists: false } }, { title_en: null }, { title_en: '' }] },
      { $set: { title_en: row.title_en } },
    );
  }
}
