export function getRandomPort(min = 49152, max = 65534): number {
  let randomPort: number;

  do {
    randomPort = Math.floor(Math.random() * (max - min + 1) + min);
  } while (!isPortAvailable(randomPort));

  return randomPort;
}

export function isPortAvailable(port: number): boolean {
  try {
    const listener = Deno.listen({
      transport: "tcp",
      hostname: "127.0.0.1",
      port,
    });
    listener.close();
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.AddrInUse) {
      return false;
    }
    throw error;
  }
}

export async function waitForPort(
  connectOptions: Deno.ConnectOptions,
): Promise<void> {
  let attempts = 60;
  const delayBetweenAttempts = 500;
  while (attempts > 0) {
    attempts--;
    try {
      const connection = await Deno.connect(connectOptions);
      connection.close();
      break;
    } catch (error) {
      if (
        error instanceof Deno.errors.ConnectionRefused
        && attempts > 0
      ) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenAttempts));
        continue;
      }
      throw error;
    }
  }
}
