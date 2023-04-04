import { description, parse, stability, title } from "../deps/egdoc.ts"
import * as fs from "../deps/std/fs.ts"

const walker = fs.walk("examples", {
  includeDirs: false,
  exts: [".eg.ts"],
})

const pending: Promise<void>[] = []
for await (const entry of walker) {
  pending.push((async () => {
    const src = await Deno.readTextFile(entry.path)
    const dest = "target/egdoc" + entry.path.substring(8, entry.path.length - 6) + ".md"
    console.log(`Transforming "${entry.path}" into "${dest}"`)
    const { frontmatter, body } = parse({
      pathname: entry.path,
      src,
      frontmatter: { title, stability, description },
    })
    const final = `# ${frontmatter.title}

${frontmatter.description}
> Stability: ${frontmatter.stability}

---

${body}`
    await fs.ensureFile(dest)
    await Deno.writeTextFile(dest, final)
  })())
}
await Promise.all(pending)

// const src = await Deno.readTextFile("examples/dynamic.eg.ts")
// const { frontmatter, body } = parse({
//   pathname: "examples/dynamic.eg.ts",
//   src,
//   frontmatter: { title, stability, description },
// })
// console.log({ frontmatter })
