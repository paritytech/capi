// TODO: fix this
// TODO: do we even care? Circular deps in imports are well-resolved, unless you do something abhorrent.

// import { denoGraph, fs, path } from "/deps.ts";

// function getCircularDeps(
//   graph: denoGraph.ModuleGraph,
//   specifier: string,
//   ancestors: string[],
//   seen: Set<string>,
// ): string[] | void {
//   console.log(graph.get(specifier));
//   if (seen.has(specifier)) {
//     return undefined;
//   }
//   if (ancestors.includes(specifier)) {
//     return [...ancestors, specifier];
//   }
//   for (const { code, type } of graph.get(specifier)!.toJSON().dependencies!) {
//     const circularDeps = getCircularDeps(
//       graph,
//       code?.specifier ?? type?.specifier!,
//       [
//         ...ancestors,
//         specifier,
//       ],
//       seen,
//     );
//     if (circularDeps) {
//       return circularDeps;
//     }
//   }
//   seen.add(specifier);
// }

// const tsSrcPathIter = fs.walk(".", {
//   match: [path.globToRegExp("**/*.ts")],
// });
// for await (const tsSrcPath of tsSrcPathIter) {
//   const circularDeps = getCircularDeps(
//     await denoGraph.createGraph(`${new URL(`../${tsSrcPath.path}`, import.meta.url)}`),
//     tsSrcPath.path,
//     [],
//     new Set<string>(),
//   );
//   if (circularDeps) {
//     console.log("Found circular dependencies", circularDeps);
//     Deno.exit(1);
//   }
//   console.log("No circular dependencies");
// }
