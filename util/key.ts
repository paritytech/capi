const unquotedKey = /^(?!__proto__$)[$_\p{ID_Start}][$\p{ID_Continue}]+$|^\d+$/u

export function stringifyKey(key: string) {
  return unquotedKey.test(key) ? key : JSON.stringify(key)
}

export function stringifyPropertyAccess(key: string) {
  return unquotedKey.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`
}
