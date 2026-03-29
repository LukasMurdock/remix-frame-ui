import { defineConfig } from "vite"

export default defineConfig({
  resolve: {
    dedupe: ["remix", "@remix-run/component"],
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "remix/component",
  },
})
