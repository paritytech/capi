import { ts } from "../barrel.ts";
import { fsWalk, globToRegExp, pathJoin } from "../barrel.ts";

const f = ts.factory;

const DEST = pathJoin("target", "star.ts");
const tsPathRegex = globToRegExp("**/*.ts");
const tsPathIter = fsWalk(".", {
  match: [tsPathRegex],
  skip: [
    new RegExp(DEST),
    globToRegExp("target/**/*.ts"),
    globToRegExp("examples/generated/**/*.ts"),
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

const destAbs = pathJoin(Deno.cwd(), DEST);
console.log(`Writing "star" file to "${destAbs}".`);
await Deno.writeFile(destAbs, new TextEncoder().encode(generated));
