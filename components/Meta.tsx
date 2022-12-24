import { Head } from "$fresh/runtime.ts"

export function Meta({ pageTitle }: { pageTitle: string }) {
  const title = `Capi Console –– ${pageTitle}`
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={title} />
    </Head>
  )
}
