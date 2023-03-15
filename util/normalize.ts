export function normalizeIdent(ident: string) {
  if (ident.startsWith("r#")) ident = ident.slice(2)
  return ident.replace(/(?:[^\p{ID_Continue}]|_)+(.)/gu, (_, $1: string) => $1.toUpperCase())
}

export function normalizeDocs(docs: string[] | undefined): string {
  return docs?.join("\n") ?? ""
}
