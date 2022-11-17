export function normalizeCase(ident: string) {
  return ident.replace(/_(.)/g, (_, $1: string) => $1.toUpperCase())
}
