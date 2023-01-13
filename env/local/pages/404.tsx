import { Fragment, h } from "../../../deps/preact.ts"

export function FourOFourPage({ message }: {
  message?: string
}) {
  return (
    <>
      <p>404 not found</p>
      {message && <span>{message}</span>}
    </>
  )
}
