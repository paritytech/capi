const ignore = (await Deno.readTextFile("examples/.ignore")).split("\n");
for await (const item of Deno.readDir("examples")) {
  if (item.isFile && item.name.endsWith(".ts") && !ignore.includes(item.name)) {
    await import(`./${item.name}`);
  }
}
