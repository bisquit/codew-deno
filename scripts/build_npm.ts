/**
 * NOTE: dnt not works for this package because `Deno.Command` is not yet supported in shim-deno.
 *
 * https://github.com/denoland/node_shims/blob/main/packages/shim-deno/PROGRESS.md
 */

import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: [{
    kind: "bin",
    name: "codew",
    path: "./src/index.ts",
  }],
  outDir: "./npm",
  scriptModule: false,
  importMap: "import_map.json",
  filterDiagnostic(d) {
    // skip type checking for dependencies
    if (/\/deps\//.test(d.file?.fileName)) {
      return false;
    }
    return true;
  },
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "codew",
    version: Deno.args[0],
    description: "Open folder as a vscode multi-root workspace",
    license: "MIT",
    repository: {
      type: "git",
      url: "https://github.com/bisquit/codew-next.git",
    },
    bugs: {
      url: "https://github.com/bisquit/codew-next/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    // Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
