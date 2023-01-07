export function splitFirst(string: string, substring: string): [string, string] | undefined {
  const slashI = string.search(substring)
  return slashI === -1 ? undefined : [string.slice(0, slashI), string.slice(slashI + 1)]
}
