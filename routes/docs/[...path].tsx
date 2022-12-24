import { PageProps } from "$fresh/server.ts"

export default function DocsPage({ params }: PageProps) {
  const path = params.path!
  return <p>Docs –– {path}</p>
}
