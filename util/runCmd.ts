export const runCmd = async (cmd: string[]): Promise<void> => {
  const p = Deno.run({
    cmd,
    stderr: "inherit",
    stdin: "inherit",
    stdout: "inherit",
  });
  try {
    const status = await p.status();
    if (!status.success) {
      console.error(status);
      Deno.exit(1);
    }
  } finally {
    p.close();
  }
};
