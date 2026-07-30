export function cleanSanityValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cleanSanityValue(item)) as T;
  }

  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== null && entryValue !== undefined)
      .map(([key, entryValue]) => [key, cleanSanityValue(entryValue)]),
  ) as T;
}
