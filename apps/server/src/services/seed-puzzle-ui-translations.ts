import seed01 from '../data/puzzle-ui-translations-01.json';
import seed02 from '../data/puzzle-ui-translations-02.json';
import seed03 from '../data/puzzle-ui-translations-03.json';
import seed04 from '../data/puzzle-ui-translations-04.json';
import seed05 from '../data/puzzle-ui-translations-05.json';
import seed06 from '../data/puzzle-ui-translations-06.json';
import { getPuzzleTranslationModel } from '../models/puzzle-translation.model';

const translations = [...seed01, ...seed02, ...seed03, ...seed04, ...seed05, ...seed06];

/**
 * Idempotent migration: populate ONLY missing translation keys in the puzzle MongoDB.
 * Existing operator-edited translations always win; no puzzle, ranking or user data changes.
 * Invoked before the HTTP server starts so the UI never sees an empty dictionary on deployment.
 */
export async function seedPuzzleUiTranslations(): Promise<void> {
  const keys = new Set<string>();
  for (const row of translations) {
    if (!row.key || !row.ko || !row.en || keys.has(row.key)) {
      throw new Error(`Invalid or duplicate puzzle translation key: ${row.key}`);
    }
    keys.add(row.key);
  }
  const Translation = getPuzzleTranslationModel();
  if (!translations.length) throw new Error('Puzzle translation seed is empty');
  const result = await Translation.bulkWrite(
    translations.map(row => ({
      updateOne: {
        filter: { key: row.key },
        update: { $setOnInsert: { key: row.key, ko: row.ko, en: row.en } },
        upsert: true,
      },
    })),
    { ordered: false },
  );
  const total = await Translation.countDocuments({ key: { $in: [...keys] } });
  if (total !== translations.length) {
    throw new Error(`Puzzle translation seed mismatch: expected ${translations.length}, found ${total}`);
  }
  console.log(`Puzzle translations: ${total} available; ${result.upsertedCount} newly inserted`);
}
