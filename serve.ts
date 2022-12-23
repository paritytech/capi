import { LocalCapiCodegenServer } from "./server/local.ts"

console.log("Listening on http://localhost:5646/")
new LocalCapiCodegenServer().listen(5646)
