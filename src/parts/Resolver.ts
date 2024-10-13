import { createPart } from "../functions";
import { Part } from "../types";
import { ProviderPart } from "./Provider";

const find = (definition: Part | string, parts: Part[]): Part | undefined =>
  parts.find(
    (part) =>
      part.definition === definition ||
      (typeof part.definition !== "string" &&
        find(definition, [part.definition])),
  );

const resolve = async <T extends Part>(
  definition: T,
  parts: Part[],
  cache = new Map<Part, any>(),
): Promise<Awaited<ReturnType<T>>> => {
  const implementation = find(definition, parts) ?? definition;
  if (cache.has(implementation)) return cache.get(implementation);

  const dependencies = [];
  for (const dependency of implementation.dependencies) {
    if (dependency === implementation.definition) {
      // Super part as dependency
      const resolved = await resolve(
        dependency,
        parts.filter((part) => !find(implementation.definition, [part])),
        cache,
      );
      dependencies.push(resolved);
    } else {
      const resolved = await resolve(dependency, parts, cache);
      dependencies.push(resolved);
    }
  }

  const resolved = (await implementation(dependencies)) as Awaited<
    ReturnType<T>
  >;
  cache.set(implementation, resolved);

  return resolved;
};

export const ResolverPart = createPart(
  "PartResolver",
  [ProviderPart],
  ([getParts]) =>
    (definition: Part): Promise<Awaited<ReturnType<Part>>> => {
      const parts = getParts();
      return resolve(definition, parts);
    },
);
