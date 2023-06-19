const command = new Deno.Command("code", {
  args: [
    ".",
  ],
});

await command.output();
