import { join } from "$std/path/mod.ts";
import { ensureDir } from "$std/fs";
import home_dir from "dir/home_dir/mod.ts";
import { match, P } from "ts-pattern";

export const homeDir = () => {
  return match(home_dir())
    .with(P.string, (v) => v)
    .with(P.nullish, () => Deno.exit())
    .exhaustive();
};

export const codewHomeDir = () => join(_internals.homeDir(), ".codew");

export const _internals = { homeDir };
