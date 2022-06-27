import * as path from "../_deps/path.ts";
import { ErrorCtor } from "./ErrorCtor.ts";

export interface RepoProps {
  repo: string;
  branch?: string;
  cloneDir: string;
  ensureSynced?: false;
  cwd?: string;
}

export async function repo(props: RepoProps): Promise<string | RepoError> {
  const dest = path.isAbsolute(props.cloneDir)
    ? props.cloneDir
    : path.join(props.cwd || Deno.cwd(), props.cloneDir);
  let process: Deno.Process;
  if (!props.ensureSynced) {
    try {
      await Deno.lstat(dest);
      return dest;
    } catch (_e) {}
  }
  try {
    await Deno.lstat(dest);
    const cmd = ["git", "pull"];
    if (props.branch) {
      cmd.push("origin", props.branch);
    }
    process = Deno.run({
      cmd,
      cwd: dest,
      stderr: "inherit",
      stdout: "inherit",
    });
  } catch (_e) {
    const cmd = ["git clone"];
    if (props.branch) {
      cmd.push("-b", props.branch);
    }
    cmd.push(props.repo, dest);
    process = Deno.run({
      cmd,
      stderr: "inherit",
      stdout: "inherit",
    });
  }
  try {
    const status = await process.status();
    if (status.success) {
      return dest;
    }
  } catch (_e) {}
  return new RepoError();
}

export class RepoError extends ErrorCtor("GitClone") {}
