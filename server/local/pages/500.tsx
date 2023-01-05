import { Fragment, h } from "../../../deps/preact.ts"

export function _500Page({ message }: { message: string }) {
  return (
    <>
      <p>500 internal error</p>
      {message && <span>{message}</span>}
    </>
  )
}
