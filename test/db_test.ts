import { exists } from "$std/fs";
import { basename, resolve } from "$std/path/mod.ts";
import { assertEquals } from "$std/testing/asserts.ts";
import { beforeEach, describe, it } from "$std/testing/bdd.ts";
import { stub } from "$std/testing/mock.ts";
import {
  _internals,
  deleteWorkspace,
  dropWorkspaces,
  insertWorkspace,
  readWorkspaces,
  Workspace,
} from "../src/db.ts";

function resolveTestTmpDir() {
  return resolve("test-tmp", basename(import.meta.url));
}

describe("db", () => {
  beforeEach(async () => {
    if (await exists(resolveTestTmpDir())) {
      await Deno.remove(resolveTestTmpDir(), { recursive: true });
    }
  });

  it("lifecycle", async () => {
    const stubCodewHomeDir = () => resolve(resolveTestTmpDir(), ".codew");
    stub(_internals, "codewHomeDir", stubCodewHomeDir);

    // READ
    assertEquals(await readWorkspaces(), []);

    // CREATE
    await insertWorkspace({
      path: "a/b/c",
      workspace: "d/tmp.vscode-workspace",
    });
    await insertWorkspace({
      path: "e/f/g",
      workspace: "h/tmp.vscode-workspace",
    });

    const decoder = new TextDecoder("utf-8");
    const buffer = await Deno.readFile(resolve(stubCodewHomeDir(), "db.json"));
    const data = JSON.parse(decoder.decode(buffer));
    const workspaces = data["workspaces"] as Workspace[];
    assertEquals(workspaces.length, 2);

    const path = workspaces[0]["path"];
    const workspace = workspaces[0]["workspace"];
    assertEquals(path, "a/b/c");
    assertEquals(workspace, "d/tmp.vscode-workspace");

    // READ
    assertEquals(await readWorkspaces(), [
      {
        path: "a/b/c",
        workspace: "d/tmp.vscode-workspace",
      },
      {
        path: "e/f/g",
        workspace: "h/tmp.vscode-workspace",
      },
    ]);

    // DELETE
    await deleteWorkspace("d/tmp.vscode-workspace");
    assertEquals(await readWorkspaces(), [
      {
        path: "e/f/g",
        workspace: "h/tmp.vscode-workspace",
      },
    ]);

    // DROP
    await dropWorkspaces();
    assertEquals(await readWorkspaces(), []);
  });
});
