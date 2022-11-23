export async function fetchText(url: string) {
  return (await fetch(url)).text()
}
