/**
 * Prevent untranslated Korean text in puzzle screens, hooks, and shared API code.
 * Includes JSX, strings, and template literal pieces (not comments).
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(__dirname, '../../web');
const targets = [
  path.join(root, 'app/puzzle'),
  path.join(root, 'components/puzzle'),
  path.join(root, 'lib/puzzle-api.ts'),
  path.join(root, 'lib/puzzle-i18n.ts'),
];
const files: string[] = [];
function walk(p: string) {
  if (!fs.existsSync(p)) return;
  if (fs.statSync(p).isDirectory()) fs.readdirSync(p).forEach(x => walk(path.join(p, x)));
  else if (/\.tsx?$/.test(p)) files.push(p);
}
targets.forEach(walk);
const findings: string[] = [];
for (const file of files) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (node: ts.Node) => {
    let value: string | undefined;
    if (ts.isJsxText(node)) value = node.text;
    else if (ts.isStringLiteralLike(node)) value = node.text;
    else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) value = node.text;
    if (value && /[가-힣]/.test(value)) {
      const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
      findings.push(`${path.relative(root, file)}:${line}: ${value.replace(/\s+/g, ' ').slice(0, 100)}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}
console.log(`Audited ${files.length} puzzle source files; found ${findings.length} embedded Korean strings`);
if (findings.length) {
  console.error(findings.join('\n'));
  process.exitCode = 1;
}
