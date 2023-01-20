export function normalizeCase(ident: string) {
  return ident.replace(/_(.)/g, (_, $1: string) => $1.toUpperCase())
}

export function normalizeKey(key: string) {
  return normalizeCase(key.startsWith("r#") ? key.slice(3) : key)
}
