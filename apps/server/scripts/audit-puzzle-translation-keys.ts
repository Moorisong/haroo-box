/**
 * Ensure every visible puzzle translation is a DB dictionary lookup, with a
 * corresponding Korean/English seed. Runtime translates exclusively from MongoDB.
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(__dirname, '../../web');
const dataDir = path.resolve(__dirname, '../src/data');
const seeds = Array.from({ length: 6 }, (_, i) => {
  const file = path.join(dataDir, `puzzle-ui-translations-0${i + 1}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8')) as { key: string; ko: string; en: string }[];
}).flat();
const seen = new Map<string, { ko: string; en: string }>();
const violations: string[] = [];
for (const row of seeds) {
  if (seen.has(row.key)) violations.push(`Duplicate seed key: ${row.key}`);
  if (!row.ko?.trim() || !row.en?.trim()) violations.push(`Missing locale value: ${row.key}`);
  if (/[가-힣]/.test(row.en)) violations.push(`English translation contains Hangul: ${row.key}`);
  seen.set(row.key, row);
}
const files: string[] = [];
function walk(target: string) {
  if (!fs.existsSync(target)) return;
  if (fs.statSync(target).isDirectory()) {
    fs.readdirSync(target).forEach(file => walk(path.join(target, file)));
  } else if (target.endsWith('.tsx')) files.push(target);
}
walk(path.join(root, 'app/puzzle'));
walk(path.join(root, 'components/puzzle'));
const used = new Set<string>();
for (const file of files) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 't') {
      const first = node.arguments[0];
      const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
      const location = `${path.relative(root, file)}:${line}`;
      if (!first || !ts.isStringLiteral(first) || !first.text.startsWith('puzzle.')) {
        violations.push(`Non-DB translation lookup at ${location}`);
      } else if (!seen.has(first.text)) {
        violations.push(`Missing DB translation seed for ${first.text} at ${location}`);
      } else {
        used.add(first.text);
      }
      if (node.arguments.length > 2 || (node.arguments.length === 2 && !ts.isObjectLiteralExpression(node.arguments[1]))) {
        violations.push(`Legacy inline translation value at ${location}`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}
console.log(`Checked ${files.length} puzzle screens, ${used.size} translation keys, ${seeds.length} database seed entries`);
if (violations.length) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
}
