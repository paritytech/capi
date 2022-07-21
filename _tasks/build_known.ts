import { snakeCase, upperCase } from "../deps/case.ts";
import ss58Registry from "../deps/ss58_registry.ts";
import * as path from "../deps/std/path.ts";

let generated = "";
let lookup = "export const LOOKUP = {\n";
for (let i = 0; i < ss58Registry.length; i++) {
  const current = ss58Registry[i]!;
  const networkNameSnakeCase = snakeCase(current.network);
  const name = upperCase(networkNameSnakeCase);
  if (current.network !== "reserved46") {
    let summation = `export const ${name} = {\n`;
    ([
      ["PREFIX", current.prefix],
      ["DISPLAY_NAME", `"${current.displayName}"`],
      [
        "SYMBOLS",
        current.symbols.length && `[${current.symbols.map((s) => `"${s}"`).join(", ")}] as const`,
      ],
      ["DECIMALS", current.decimals.length && `[${current.decimals.join(", ")}] as const`],
      ["STD_ACCOUNT", `"${current.standardAccount}"`],
      ["WEBSITE", `"${current.website}"`],
    ] as const).forEach(([id, span]) => {
      if (span) {
        const finalId = `${name}_${id}`;
        generated += `export const ${finalId} = ${span};\n`;
        summation += `  ${id}: ${finalId},\n`;
      }
    });
    generated += `${summation}} as const;\nexport type ${name} = typeof ${name};\n\n`;
    lookup += `  ${networkNameSnakeCase}: ${name},\n`;
  }
}
const final =
  `// @generated file from build script, do not edit\n\n${generated}${lookup}} as const;\nexport type LOOKUP = typeof LOOKUP;\n`;
const dest = path.join(Deno.cwd(), `known/generated.ts`);
console.log(`Writing "${dest}".`);
await Deno.writeTextFile(dest, final);
