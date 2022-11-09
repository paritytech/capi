// This script runs all examples in sequence. We should ultimately delete this script...
// ... but it's currently proving useful for local debugging.

const ignore = ["all.ts", (await Deno.readTextFile("examples/.ignore")).split("\n")];
for await (const item of Deno.readDir("examples")) {
  if (item.isFile && item.name.endsWith(".ts") && !ignore.includes(item.name)) {
    await import(`./${item.name}`);
  }
}
