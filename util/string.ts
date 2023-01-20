export type Splitter = (char: string, src: string) => undefined | [string, string]

export const [splitFirst, splitLast] = (["indexOf", "lastIndexOf"] as const).map((m) => {
  return (char, src) => {
    const i = src[m](char)
    if (i === -1) return undefined
    return [src.slice(0, i), src.slice(i + 1)]
  }
}) as [Splitter, Splitter]
