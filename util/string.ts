export function splitFirst(char: string, src: string): [string, string] | undefined {
  const colonI = src.indexOf(char)
  if (colonI === -1) return undefined
  return [src.slice(0, colonI), src.slice(colonI + 1)]
}
