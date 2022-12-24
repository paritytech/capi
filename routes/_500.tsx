import { ErrorPageProps } from "$fresh/server.ts"

export default function ErrorPage({ error }: ErrorPageProps) {
  return (
    <p>
      500 internal error: {error instanceof Error
        ? error.message
        : `the following data was thrown: ${JSON.stringify(error)}`}
    </p>
  )
}
