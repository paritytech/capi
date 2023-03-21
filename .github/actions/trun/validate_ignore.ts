import { parse } from "./deps/std/flags.ts"

const { dir, ignore } = parse(Deno.args, {
  string: ["dir", "ignore"],
  default: { ignore: ".ignore" },
})
if (!dir) {
  throw new Error("dir flag missing")
}

const files = (await Deno.readTextFile(`${dir}/${ignore}`))
  .split("\n")
  .filter(Boolean)

const result = await Promise.all(
  files.map((fileName) => `${dir}/${fileName}`)
    .map((path) =>
      Deno.stat(path)
        .then(() => [path, true] as const)
        .catch(() => [path, false] as const)
    ),
)

const nonExistentFiles = result.filter(([_, exists]) => !exists)
if (nonExistentFiles.length > 0) {
  console.error(nonExistentFiles.map(([path, _]) => path))
  Deno.exit(1)
}
