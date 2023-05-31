export function normalizeIdent(ident: string) {
  if (ident.startsWith("r#")) ident = ident.slice(2)
  return normalizeKeyword(
    ident.replace(/(?:[^\p{ID_Continue}]|_)+(.)/gu, (_, $1: string) => $1.toUpperCase()),
  )
}

export function normalizeDocs(docs: string[] | undefined): string {
  return docs?.join("\n") ?? ""
}

export function normalizePackageName(name: string) {
  return name.replace(/[A-Z]/g, (x) => `-` + x.toLowerCase())
}

export function normalizeTypeName(name: string) {
  return normalizeIdent(name).replace(/^./, (x) => x.toUpperCase())
}

export function normalizeVariableName(name: string) {
  return normalizeIdent(name).replace(/^./, (x) => x.toLowerCase())
}

const keywords = ["import"]
function normalizeKeyword(ident: string) {
  return keywords.includes(ident) ? ident + "_" : ident
}
