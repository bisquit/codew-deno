import { resolve } from "node:path";

import { readWorkspaces } from "../db.ts";
import { createFileComponents } from "../utils/file-components.ts";
import { Workspace } from "../types.ts";

export async function getWorkspace(
  dir: string,
): Promise<Workspace | undefined> {
  const { filepath: dirPath } = createFileComponents(resolve(dir));

  const workspace = (await readWorkspaces()).find(
    (w) => w.dirPath === dirPath,
  );

  if (!workspace) {
    return;
  }

  return workspace;
}
