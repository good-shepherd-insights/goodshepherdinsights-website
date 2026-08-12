export type SchemaNode = Record<string, any>;

export function flattenSchemaNodes(jsonLd: unknown[]): SchemaNode[] {
  return jsonLd.flatMap((item) => {
    if (!isRecord(item)) return [];
    const graph = item["@graph"];
    return Array.isArray(graph)
      ? graph.filter(isRecord)
      : [item].filter(isRecord);
  });
}

export function assertJsonLdDocuments(pathname: string, jsonLd: unknown[]) {
  for (const item of jsonLd) {
    if (!isRecord(item)) {
      throw new Error(`${pathname} JSON-LD document must be an object`);
    }

    if (item["@context"] !== "https://schema.org") {
      throw new Error(`${pathname} JSON-LD document is missing schema.org @context`);
    }

    const graph = item["@graph"];
    const hasGraph =
      Array.isArray(graph) && graph.length > 0 && graph.every(isRecord);
    const hasNode = typeof item["@type"] === "string" || Array.isArray(item["@type"]);
    if (!hasGraph && !hasNode) {
      throw new Error(`${pathname} JSON-LD document must contain @graph or @type`);
    }
  }
}

export function schemaTypes(nodes: SchemaNode[]) {
  return nodes.flatMap((node) => {
    const type = node["@type"];
    return Array.isArray(type) ? type : type ? [type] : [];
  });
}

export function findNodeByType(nodes: SchemaNode[], type: string) {
  return nodes.find((node) => schemaTypes([node]).includes(type));
}

export function findNodesByType(nodes: SchemaNode[], type: string) {
  return nodes.filter((node) => schemaTypes([node]).includes(type));
}

export function findNodeById(nodes: SchemaNode[], id: string | undefined) {
  if (!id) return undefined;
  return nodes.find((node) => node["@id"] === id);
}

export function idReference(value: unknown) {
  return isRecord(value) && typeof value["@id"] === "string"
    ? value["@id"]
    : undefined;
}

export function assertAbsoluteIds(pathname: string, nodes: SchemaNode[]) {
  for (const node of nodes) {
    const id = node["@id"];
    if (id !== undefined) {
      expect(typeof id).toBe("string");
      if (!id.match(/^https:\/\//)) {
        throw new Error(`${pathname} schema @id must be absolute: ${id}`);
      }
    }
  }
}

function isRecord(value: unknown): value is SchemaNode {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
