import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import { getWorkspace } from "./operations/get-workspace.ts";
import { createWorkspace } from "./operations/create-workspace.ts";
import { openWorkspace } from "./operations/open-workspace.ts";

const { args } = await new Command()
  .name("codew")
  .version("0.0.1")
  .description("Open folder as a vscode multi-root workspace")
  .example("open current directory", "codew .")
  .arguments("<path>")
  .parse(Deno.args);

const path = args[0];

const workspace = await getWorkspace(path);

if (workspace) {
  await openWorkspace(workspace.codeWorkspacePath);
} else {
  const workspace = await createWorkspace(path);
  await openWorkspace(workspace.codeWorkspacePath);
}
