import * as fs from "../_deps/fs.ts";
import * as path from "../_deps/path.ts";

let generated = "";
for await (
  const entry of fs.walk(".", {
    match: [/\.ts$/],
    skip: [/^target\//],
  })
) {
  generated += `import ${JSON.stringify(`./${entry.path}`)};\n`;
}

const dest = path.join(Deno.cwd(), "_star.ts");
console.log(`Writing "star" file to "${dest}".`);
await Deno.writeTextFile(dest, generated);
