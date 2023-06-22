import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { ensureDir } from "$std/fs";

import { codewHomeDir } from "./context.ts";
import { Workspace } from "./types.ts";

export type Data = {
  workspaces: Workspace[];
};

async function getDb() {
  const defaultData: Data = { workspaces: [] };
  const adapter = new JSONFile<Data>(`${_internals.codewHomeDir()}/db.json`);
  const db = new Low<Data>(adapter, defaultData);
  await db.read();
  return db;
}

export async function readWorkspaces(): Promise<ReadonlyArray<Workspace>> {
  const db = await getDb();
  return db.data.workspaces;
}

export async function insertWorkspace(workspace: Workspace) {
  const db = await getDb();
  db.data.workspaces.push(workspace);
  await ensureDir(_internals.codewHomeDir());
  await db.write();
}

export async function deleteWorkspace(codeWorkspacePath: string) {
  const db = await getDb();
  db.data.workspaces = db.data.workspaces.filter(
    (v) => v.codeWorkspacePath !== codeWorkspacePath,
  );
  await db.write();
}

export async function dropWorkspaces() {
  const db = await getDb();
  db.data.workspaces = [];
  await db.write();
}

export const _internals = { codewHomeDir };
