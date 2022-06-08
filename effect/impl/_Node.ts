export type _Node = (
  | {
    kind: "syncFunc";
    fn: (...args: unknown[]) => unknown;
    deps: _Node[];
    resolved: boolean;
    value: unknown;
  }
  | {
    kind: "asyncFunc";
    fn: (...args: unknown[]) => Promise<unknown>;
    deps: _Node[];
    resolved: boolean;
    value: unknown;
    running: boolean;
    promise: Promise<unknown> | undefined;
  }
  | {
    kind: "value";
    resolved: true;
    value: unknown;
  }
);

export type _SyncNode = _Node & ({ kind: "syncFunc" } | { resolved: true });

interface Frame {
  nodes: _Node[];
  i: number;
  backtracking: boolean;
}

export function _valueNode(value: unknown): _Node {
  return { kind: "value", resolved: true, value };
}

export function _runSyncNode(node: _SyncNode) {
  const todo: Frame[] = [{ nodes: [node], i: 0, backtracking: false }];
  while (todo.length) {
    const frame = todo[todo.length - 1]!;
    const node = frame.nodes[frame.i];
    if (!node) {
      todo.pop();
      continue;
    }
    if (node.resolved) {
      if (node.value instanceof Error) {
        return node.value;
      }
      frame.i++;
      continue;
    }
    if (frame.backtracking) {
      const value = node.fn(...node.deps.map((x) => x.value));
      node.resolved = true;
      node.value = value;
      if (value instanceof Error) {
        return value;
      }
      frame.i++;
      frame.backtracking = false;
      continue;
    } else {
      frame.backtracking = true;
      todo.push({ nodes: node.deps, i: 0, backtracking: false });
    }
  }
  return node.value;
}

export function _runAsyncNode(node: _Node) {
  let earlyExit = false;
  let resolve: (value: unknown) => void;
  const promise = new Promise((r) => resolve = r);
  const todo: Frame[] = [{ nodes: [node], i: 0, backtracking: false }];
  while (todo.length) {
    const frame = todo[todo.length - 1]!;
    const node = frame.nodes[frame.i];
    if (!node) {
      todo.pop();
      continue;
    }
    if (node.resolved) {
      if (node.value instanceof Error) {
        earlyExit = true;
        return node.value;
      }
      frame.i++;
      continue;
    }
    const unresolvedIndex = node.deps.findIndex((x) => !x.resolved);
    if (frame.backtracking || !node.deps.length) {
      if (unresolvedIndex === -1) {
        if (node.kind === "syncFunc") {
          const value = node.fn(...node.deps.map((x) => x.value));
          node.resolved = true;
          node.value = value;
          if (value instanceof Error) {
            earlyExit = true;
            return value;
          }
        } else {
          queueStrand(todo.map((e) => e.nodes[e.i]!) as never);
        }
        if (earlyExit) break;
      }
      frame.i++;
      frame.backtracking = false;
    } else {
      frame.backtracking = true;
      todo.push({ nodes: node.deps, i: unresolvedIndex, backtracking: false });
    }
  }
  return promise;

  async function queueStrand(nodes: Exclude<_Node, { kind: "value" }>[]) {
    let value: unknown;
    while (nodes.length) {
      const node = nodes.pop()!;
      if (!node.deps.every((x) => x.resolved)) return;
      if (node.kind === "syncFunc") {
        value = node.fn(...node.deps.map((x) => x.value));
        node.resolved = true;
        node.value = value;
      } else {
        if (!node.running) {
          node.running = true;
          node.promise = node.fn(...node.deps.map((x) => x.value));
          node.promise.then((value) => {
            node.running = false;
            node.resolved = true;
            node.value = value;
          });
        }
        value = await node.promise!;
      }
      if (value instanceof Error) {
        earlyExit = true;
        resolve(value);
        return;
      }
    }
    resolve(value!);
  }
}
