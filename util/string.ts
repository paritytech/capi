export function splitFirst(substring: string) {
  return (string: string): [string, string] | undefined => {
    const slashI = string.search(substring)
    return slashI === -1 ? undefined : [string.slice(0, slashI), string.slice(slashI + 1)]
  }
}
