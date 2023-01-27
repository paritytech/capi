export function splitFirst(char: string, src: string) {
  const i = src.indexOf(char)
  return i === -1 ? undefined : [src.slice(0, i), src.slice(i, 1)]
}

export function splitLast(char: string, src: string) {
  const i = src.lastIndexOf(char)
  return i === -1 ? undefined : [src.slice(0, i), src.slice(i, 1)]
}
