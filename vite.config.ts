import path from "path";
import { defineConfig } from "vite";

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "Boxes",
      fileName: (format) => `boxes.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["Boxes"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          Boxes: "Boxes",
        },
      },
    },
  },
});
