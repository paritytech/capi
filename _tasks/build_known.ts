import * as path from "../_deps/path.ts";
import ss58Registry from "../_deps/ss58_registry.ts";

let generated = "// @generated file from build script, do not edit";
generated += "\nexport type Ss58Lookup = ";
for (let i = 0; i < ss58Registry.length; i++) {
  const current = ss58Registry[i]!;
  if (i !== 0) {
    generated += " | ";
  }
  generated += `{
  prefix: ${current.prefix};
  network: "${current.network}";
  displayName: "${current.displayName}";
  symbols: [${current.symbols.map((s) => `"${s}"`).join(", ")}];
  decimals: [${current.decimals.join(", ")}];
  standardAccount: "${current.standardAccount}";
  website: "${current.website}";
}`;
}
generated += ";\n";
const dest = path.join(Deno.cwd(), "known/generated.ts");
console.log(`Writing "${dest}".`);
await Deno.writeTextFile(dest, generated);
