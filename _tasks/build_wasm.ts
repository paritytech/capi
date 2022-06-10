import "https://deno.land/x/wasmbuild@0.5.0/main.ts";

// fix bug in wasmbuild output
// TODO: submit issue to wasmbuild

const path = Deno.args[1]! + "/mod.generated.js";
let content = await Deno.readTextFile(path);
for (const bufName of ["cachedInt32Memory0", "cachedUint8Memory0"]) {
  const code = `\nlet ${bufName};\n`;
  if (!content.includes(code)) {
    content += code;
  }
}
await Deno.writeTextFile(path, content);
