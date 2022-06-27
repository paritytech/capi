export async function exists(inQuestion: string): Promise<boolean> {
  try {
    await Deno.lstat(inQuestion);
    return true;
  } catch (_e) {
    return false;
  }
}
