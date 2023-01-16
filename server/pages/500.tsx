import { Fragment, h } from "../../deps/preact.ts"

export function FiveHundredPage({ message }: { message?: string }) {
  return (
    <>
      <p>500 internal error</p>
      {message && <span>{message}</span>}
    </>
  )
}
