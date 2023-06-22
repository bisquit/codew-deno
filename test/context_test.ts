import { assertEquals } from "$std/testing/asserts.ts";
import { stub } from "$std/testing/mock.ts";
import { _internals, codewHomeDir } from "../src/context.ts";

Deno.test("context", () => {
  stub(_internals, "homeDir", () => "tmp");

  assertEquals(codewHomeDir(), "tmp/.codew");
});
