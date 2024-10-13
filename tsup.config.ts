import { defineConfig } from "tsup";

export default defineConfig({
  entry: { "part-di": "src/index.ts" },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  clean: true,
});
