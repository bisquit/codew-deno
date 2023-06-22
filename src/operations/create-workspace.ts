import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { insertWorkspace } from "../db.ts";
import { createFileComponents } from "../utils/file-components.ts";
import { createWorkspaceTemplate } from "../utils/template.ts";
import { ensureDir } from "$std/fs";
import { join } from "$std/path/mod.ts";
import { codewHomeDir } from "../context.ts";
import { Workspace } from "../types.ts";

export async function createWorkspace(
  dir: string,
  options?: { workspaceName?: string },
): Promise<Workspace> {
  const { filepath, filename } = createFileComponents(
    resolve(dir),
  );

  const data = createWorkspaceTemplate({ path: filepath });

  const workspacesDir = join(codewHomeDir(), "workspaces");
  const codeWorkspacePath = `${workspacesDir}/${
    options?.workspaceName ?? filename
  }.code-workspace`;

  const workspace = {
    dirPath: filepath,
    codeWorkspacePath: codeWorkspacePath,
  } satisfies Workspace;

  await ensureDir(workspacesDir);
  await writeFile(codeWorkspacePath, data, {});

  await insertWorkspace(workspace);

  return workspace;
}
