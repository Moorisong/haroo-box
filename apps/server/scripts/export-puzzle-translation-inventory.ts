/** Read-only inventory of ALL puzzle titles, including archived puzzles.
 * Run: PUZZLE_MONGODB_URI=... npx tsx scripts/export-puzzle-translation-inventory.ts
 * Redirect output to a JSON file for translation review. No writes are performed.
 */
import 'dotenv/config';
import mongoose from 'mongoose';

async function main() {
  const uri = process.env.PUZZLE_MONGODB_URI;
  if (!uri) throw new Error('PUZZLE_MONGODB_URI is required');
  await mongoose.connect(uri);
  try {
    const rows = await mongoose.connection.collection('puzzles')
      .find({}, { projection: { _id: 1, week: 1, title: 1, title_en: 1, description: 1, description_en: 1, archived: 1 } })
      .sort({ week: 1 }).toArray();
    process.stdout.write(JSON.stringify(rows.map(p => ({
      _id: String(p._id), week: p.week, title: p.title, title_en: p.title_en || '',
      description: p.description || '', description_en: p.description_en || '',
      archived: Boolean(p.archived)
    })), null, 2) + '\n');
  } finally { await mongoose.disconnect(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
