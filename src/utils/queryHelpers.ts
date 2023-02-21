import { schemaWithId } from "../Model";

interface HasUid<T> extends schemaWithId<T> {}

export function search<T, S extends HasUid<T>>(
  query: T | schemaWithId<T>,
  data: S[]
): S[] {
  return data.filter((record) => {
    return Object.keys(query).every((key) => query[key] === record[key]);
  });
}

export function searchOne<T, S extends HasUid<T>>(
  query: T | schemaWithId<T>,
  data: S[]
): S | undefined {
  const index = getIndex(query, data);
  if (index === -1) {
    return;
  }
  return data[index];
}

export function getIndex<T, S extends HasUid<T>>(
  query: T | schemaWithId<T>,
  data: S[]
): number {
  return data.findIndex((record) =>
    Object.keys(query).every((key) => query[key] === record[key])
  );
}
