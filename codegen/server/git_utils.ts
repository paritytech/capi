export async function getModuleIndex() {
  const cmd = Deno.run({
    cmd: ["git", "ls-files"],
    stdout: "piped",
  })
  if (!(await cmd.status()).success) throw new Error("git ls-files failed")
  const output = new TextDecoder().decode(await cmd.output())
  return output.split("\n").filter((x) => x.endsWith(".ts"))
}

export async function getSha() {
  const cmd = Deno.run({
    cmd: ["git", "rev-parse", "@"],
    stdout: "piped",
  })
  if (!(await cmd.status()).success) throw new Error("git rev-parse failed")
  const output = new TextDecoder().decode(await cmd.output())
  return output
}
