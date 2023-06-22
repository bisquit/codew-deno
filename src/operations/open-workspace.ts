export async function openWorkspace(codeWorkspacePath: string) {
  const command = new Deno.Command("code", {
    args: [
      `${codeWorkspacePath}`,
    ],
  });

  await command.output();
}
