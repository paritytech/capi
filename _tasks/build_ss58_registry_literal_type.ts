import * as path from "../_deps/path.ts";
import ss58Registry from "../_deps/ss58_registry.ts";

let generated = "// @generated file from build script, do not edit";
generated += "\nexport type Ss58Registry = ";
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
generated += ";";
const dest = path.join(Deno.cwd(), "bindings/ss58/registry.ts");
console.log(`Writing "registry" file to "${dest}".`);
await Deno.writeTextFile(dest, generated);
