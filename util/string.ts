export function splitFirst(char: string, src: string): [string, string] | undefined {
  const i = src.indexOf(char)
  if (i === -1) return undefined
  return [src.slice(0, i), src.slice(i + 1)]
}
