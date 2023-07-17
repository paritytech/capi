export function formatDocComment(docs: string) {
  if (!docs) return ""
  if (!docs.includes("\n")) return `/** ${docs} */`
  return `/**\n${docs.replace(/^/gm, " * ")}\n*/`
}
