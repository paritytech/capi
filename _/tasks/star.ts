import * as fs from "std/fs/mod.ts";
import * as path from "std/path/mod.ts";
import ts from "typescript";

const f = ts.factory;

const DEST = path.join("target", "_star.ts");
const tsPathRegex = path.globToRegExp("**/*.ts");
const tsPathIter = fs.walk(".", {
  match: [tsPathRegex],
  skip: [
    new RegExp(DEST),
    path.globToRegExp("target/**/*.ts"),
    path.globToRegExp("examples/.capi/**/*.ts"),
  ],
});
const importDeclarations: ts.ImportDeclaration[] = [];
let i = 0;

for await (const walkEntry of tsPathIter) {
  importDeclarations.push(f.createImportDeclaration(
    undefined,
    undefined,
    f.createImportClause(
      false,
      undefined,
      f.createNamespaceImport(f.createIdentifier(`_${i}`)),
    ),
    f.createStringLiteral(`../${walkEntry.path}`),
    undefined,
  ));
  i += 1;
}

const generated = ts.createPrinter().printList(
  ts.ListFormat.MultiLine,
  f.createNodeArray(importDeclarations),
  undefined as any,
);

const destAbs = path.join(Deno.cwd(), DEST);
console.log(`Writing "star" file to "${destAbs}".`);
await Deno.writeFile(destAbs, new TextEncoder().encode(generated));
