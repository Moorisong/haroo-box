/**
 * Safe, repeatable backfill of English titles/descriptions for current and archived puzzles.
 *
 * Usage (from apps/server):
 *   npx tsx scripts/backfill-puzzle-english.ts --input scripts/puzzle-translations.json
 *   npx tsx scripts/backfill-puzzle-english.ts --input scripts/puzzle-translations.json --apply
 *
 * Dry run is the default. Never deletes puzzles, results or progress. Existing translations
 * are preserved unless --overwrite is explicitly supplied. Review and back up production
 * data before applying. Each row must match an existing puzzle _id.
 */
import 'dotenv/config';
import fs from 'node:fs';
import mongoose from 'mongoose';

type Translation = { _id: string; title_en: string; description_en?: string };
const args = process.argv.slice(2);
const input = args[args.indexOf('--input') + 1];
if (!input || !args.includes('--input')) throw new Error('Supply --input path to a reviewed JSON array.');
const apply = args.includes('--apply');
const overwrite = args.includes('--overwrite');
const entries = JSON.parse(fs.readFileSync(input, 'utf8')) as Translation[];
if (!Array.isArray(entries)) throw new Error('Input must be a JSON array.');
const seen = new Set<string>();
for (const row of entries) {
  if (!row._id || !mongoose.isValidObjectId(row._id) || !row.title_en?.trim() || /[가-힣]/.test(row.title_en) || (row.description_en && /[가-힣]/.test(row.description_en))) throw new Error('Invalid translation row: ' + JSON.stringify(row));
  if (seen.has(row._id)) throw new Error('Duplicate puzzle ID: ' + row._id);
  seen.add(row._id);
}
const uri = process.env.PUZZLE_MONGODB_URI;
if (!uri) throw new Error('PUZZLE_MONGODB_URI is required. Refusing to infer a database.');
async function main() {
  await mongoose.connect(uri!);
  try {
    const collection = mongoose.connection.collection('puzzles');
    const all = await collection.find({}, { projection: { _id: 1, title: 1, title_en: 1, description_en: 1, archived: 1 } }).toArray();
    const byId = new Map(all.map(p => [String(p._id), p]));
    const unknown = entries.filter(e => !byId.has(e._id));
    if (unknown.length) throw new Error('Unknown puzzle IDs: ' + unknown.map(e => e._id).join(', '));
    const missing = all.filter(p => !p.title_en?.trim() && !seen.has(String(p._id)));
    console.log(JSON.stringify({ totalPuzzles: all.length, translationsProvided: entries.length, uncoveredPuzzles: missing.map(p => ({ id: String(p._id), title: p.title, archived: p.archived })), mode: apply ? 'APPLY' : 'DRY_RUN' }, null, 2));
    if (missing.length) throw new Error('Translation input does not cover every untranslated puzzle. No writes performed.');
    if (!apply) return;
    let updated = 0;
    for (const row of entries) {
      const set: Record<string, string> = {};
      if (overwrite || !byId.get(row._id)?.title_en) set.title_en = row.title_en.trim();
      if (row.description_en?.trim() && (overwrite || !byId.get(row._id)?.description_en)) set.description_en = row.description_en.trim();
      if (Object.keys(set).length) {
        await collection.updateOne({ _id: new mongoose.Types.ObjectId(row._id) }, { $set: set });
        updated++;
      }
    }
    console.log('Updated', updated, 'puzzles; no IDs or play data changed.');
  } finally { await mongoose.disconnect(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
