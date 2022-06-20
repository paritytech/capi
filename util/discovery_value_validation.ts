// TODO: validate chain spec as well
// TODO: better ws validation

export function isWsUrl(inQuestion: string): boolean {
  return inQuestion.startsWith("wss://");
}
