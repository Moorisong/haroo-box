/**
 * CI guard: reject untranslated Hangul hardcoded as visible JSX text/attributes.
 * This checks source literals, not dynamic API content or Korean fallback strings inside t(...).
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(__dirname, '../../web');
const targets = [path.join(root, 'app/puzzle'), path.join(root, 'components/puzzle')];
const files: string[] = [];
function walk(p: string) {
  if (!fs.existsSync(p)) return;
  if (fs.statSync(p).isDirectory()) {
    for (const item of fs.readdirSync(p)) walk(path.join(p, item));
  } else if (p.endsWith('.tsx')) files.push(p);
}
targets.forEach(walk);
const findings: string[] = [];
for (const file of files) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const find = (node: ts.Node) => {
    let visible: string | undefined;
    if (ts.isJsxText(node)) visible = node.text;
    else if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer)) visible = node.initializer.text;
    if (visible && /[가-힣]/.test(visible)) {
      const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
      findings.push(`${path.relative(root, file)}:${line}: ${visible.trim().replace(/\s+/g, ' ').slice(0, 110)}`);
    }
    ts.forEachChild(node, find);
  };
  find(source);
}
console.log(`Audited ${files.length} puzzle TSX files: ${findings.length} hardcoded Korean JSX literals`);
if (findings.length) {
  console.error(findings.join('\n'));
  process.exitCode = 1;
}
