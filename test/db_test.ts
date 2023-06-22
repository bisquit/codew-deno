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
} from "../src/db.ts";
import { Workspace } from "../src/types.ts";

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
      dirPath: "a/b/c",
      codeWorkspacePath: "d/tmp.vscode-workspace",
    });
    await insertWorkspace({
      dirPath: "e/f/g",
      codeWorkspacePath: "h/tmp.vscode-workspace",
    });

    const decoder = new TextDecoder("utf-8");
    const buffer = await Deno.readFile(resolve(stubCodewHomeDir(), "db.json"));
    const data = JSON.parse(decoder.decode(buffer));
    const workspaces = data["workspaces"] as Workspace[];
    assertEquals(workspaces.length, 2);

    const dirPath = workspaces.at(0)?.dirPath;
    const codeWorkspacePath = workspaces.at(0)?.codeWorkspacePath;
    assertEquals(dirPath, "a/b/c");
    assertEquals(codeWorkspacePath, "d/tmp.vscode-workspace");

    // READ
    assertEquals(await readWorkspaces(), [
      {
        dirPath: "a/b/c",
        codeWorkspacePath: "d/tmp.vscode-workspace",
      },
      {
        dirPath: "e/f/g",
        codeWorkspacePath: "h/tmp.vscode-workspace",
      },
    ]);

    // DELETE
    await deleteWorkspace("d/tmp.vscode-workspace");
    assertEquals(await readWorkspaces(), [
      {
        dirPath: "e/f/g",
        codeWorkspacePath: "h/tmp.vscode-workspace",
      },
    ]);

    // DROP
    await dropWorkspaces();
    assertEquals(await readWorkspaces(), []);
  });
});
