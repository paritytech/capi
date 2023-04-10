export function gracefulExit(code: number) {
  self.addEventListener("unload", () => Deno.exit(code))
}
