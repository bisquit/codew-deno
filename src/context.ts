import { join } from "https://deno.land/std@0.192.0/path/mod.ts";
import home_dir from "https://deno.land/x/dir@1.5.1/home_dir/mod.ts";
import { match, P } from "npm:ts-pattern@5.0.1";

export const homeDir = () => {
  return match(home_dir())
    .with(P.string, (v) => v)
    .with(P.nullish, () => Deno.exit())
    .exhaustive();
};

export const codewHomeDir = () => join(_internals.homeDir(), ".codew");

export const _internals = { homeDir };
