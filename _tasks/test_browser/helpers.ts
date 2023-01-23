export const pathToJS = (path: string) => path.replace(".ts", ".js")
export const pathToHTML = (path: string) => path.replace(".ts", ".html")
export const pathToName = (path: string) => path.split("/").pop()?.split(".")[0]

export function createPausePromise() {
  let resolve: (v?: unknown) => void
  const promise = new Promise((r) => {
    resolve = r
  })
  function done() {
    resolve()
  }
  function wait() {
    return promise
  }
  return { done, wait }
}
