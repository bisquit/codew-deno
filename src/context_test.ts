import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { stub } from "https://deno.land/std@0.192.0/testing/mock.ts";
import { _internals, codewHomeDir } from "./context.ts";

Deno.test("context", () => {
  stub(_internals, "homeDir", () => "tmp");

  assertEquals(codewHomeDir(), "tmp/.codew");
});
