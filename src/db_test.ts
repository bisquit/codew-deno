import { exists } from "$std/fs";
import { basename, resolve } from "$std/path/mod.ts";
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import {
  beforeEach,
  describe,
  it,
} from "https://deno.land/std@0.192.0/testing/bdd.ts";
import { stub } from "https://deno.land/std@0.192.0/testing/mock.ts";
import { _internals, insertWorkspace, readWorkspaces } from "./db.ts";

function resolveTestTmpDir() {
  return resolve("test-tmp", basename(import.meta.url));
}

describe("db", () => {
  beforeEach(async () => {
    if (await exists(resolveTestTmpDir())) {
      await Deno.remove(resolveTestTmpDir(), { recursive: true });
    }
  });

  it("manages", async () => {
    const stubCodewHomeDir = () => resolve(resolveTestTmpDir(), ".codew");
    stub(_internals, "codewHomeDir", stubCodewHomeDir);

    assertEquals(await readWorkspaces(), []);

    await insertWorkspace({
      path: "a/b/c",
      workspace: "d/tmp.vscode-workspace",
    });

    const decoder = new TextDecoder("utf-8");
    const buffer = await Deno.readFile(resolve(stubCodewHomeDir(), "db.json"));
    const data = JSON.parse(decoder.decode(buffer));
    const path = data["workspaces"][0]["path"];
    const workspace = data["workspaces"][0]["workspace"];
    assertEquals(path, "a/b/c");
    assertEquals(workspace, "d/tmp.vscode-workspace");
  });
});
