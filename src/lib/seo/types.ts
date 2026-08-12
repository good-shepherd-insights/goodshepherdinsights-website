export type SchemaNode = Record<string, unknown>;

export type SchemaGraph = {
  "@context": "https://schema.org";
  "@graph": SchemaNode[];
};

export function removeEmptySchemaValues<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => removeEmptySchemaValues(item))
      .filter(
        (item) => item !== undefined && item !== null && item !== "",
      ) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([key, item]) => [key, removeEmptySchemaValues(item)])
        .filter(([, item]) => {
          if (item === undefined || item === null || item === "") return false;
          if (Array.isArray(item) && item.length === 0) return false;
          return true;
        }),
    ) as T;
  }

  return value;
}

export function schemaGraph(nodes: Array<SchemaNode | undefined>): SchemaGraph {
  return {
    "@context": "https://schema.org",
    "@graph": nodes
      .filter((node): node is SchemaNode => Boolean(node))
      .map((node) => removeEmptySchemaValues(node)),
  };
}
