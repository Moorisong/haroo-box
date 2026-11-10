/**
 * Extract UI translation pairs from puzzle TSX and seed MongoDB without deleting anything.
 * Default = dry run. After reviewing and backing up production, pass --apply.
 *
 * cd apps/server
 * PUZZLE_MONGODB_URI=... npx ts-node scripts/seed-puzzle-translations.ts
 * PUZZLE_MONGODB_URI=... npx tsx scripts/seed-puzzle-translations.ts --apply
 *
 * Existing DB translations are always authoritative and never overwritten.
 * This is an initial compatibility import; new UI copy should use stable DB keys.
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import ts from 'typescript';

const webRoot = path.resolve(__dirname, '../../web');
const folders = ['app/puzzle', 'components/puzzle', 'components/providers/language-provider.tsx'];
const sourcePaths: string[] = [];
function walk(p: string) {
  if (!fs.existsSync(p)) return;
  if (fs.statSync(p).isDirectory()) {
    for (const name of fs.readdirSync(p)) walk(path.join(p, name));
  } else if (/\.tsx?$/.test(p)) sourcePaths.push(p);
}
folders.forEach(f => walk(path.join(webRoot, f)));
const dictionary = new Map<string, { key: string; ko: string; en: string }>();
let unresolved = 0;
for (const file of sourcePaths) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 't') {
      const [ko, en] = node.arguments;
      if (ko && en && ts.isStringLiteralLike(ko) && ts.isStringLiteralLike(en)) {
        const entry = { key: `${ko.text}␟${en.text}`, ko: ko.text, en: en.text };
        dictionary.set(entry.key, entry);
      } else unresolved++;
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}
const uri = process.env.PUZZLE_MONGODB_URI;
if (!uri) throw new Error('Set PUZZLE_MONGODB_URI explicitly to prevent writing to another database.');
async function main() {
  await mongoose.connect(uri!);
  try {
    const collection = mongoose.connection.collection('puzzletranslations');
    const keys = [...dictionary.keys()];
    const existing = await collection.find({ key: { $in: keys } }, { projection: { key: 1 } }).toArray();
    const existingSet = new Set(existing.map(row => row.key));
    const pending = [...dictionary.values()].filter(entry => !existingSet.has(entry.key));
    console.log(JSON.stringify({ scannedFiles: sourcePaths.length, extracted: dictionary.size, dynamicExpressionsToReview: unresolved, existing: existing.length, toInsert: pending.length, mode: process.argv.includes('--apply') ? 'APPLY' : 'DRY_RUN' }, null, 2));
    if (!process.argv.includes('--apply') || pending.length === 0) return;
    const result = await collection.bulkWrite(pending.map(entry => ({
      updateOne: { filter: { key: entry.key }, update: { $setOnInsert: { key: entry.key, ko: entry.ko, en: entry.en, createdAt: new Date(), updatedAt: new Date() } }, upsert: true }
    })), { ordered: false });
    console.log('Inserted translations:', result.upsertedCount);
  } finally { await mongoose.disconnect(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
