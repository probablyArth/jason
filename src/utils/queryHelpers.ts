import { Query, SchemaWithId } from "../types";

export function search<T>(
  query: Query<T>,
  data: SchemaWithId<T>[]
): SchemaWithId<T>[] {
  return data.filter((record) => {
    return Object.keys(query).every((key) => query[key] === record[key]);
  });
}

export function searchOne<T>(
  query: Query<T>,
  data: SchemaWithId<T>[]
): SchemaWithId<T> | undefined {
  const index = getIndex(query, data);
  if (index === -1) {
    return;
  }
  return data[index];
}

export function getIndex<T>(
  query: Query<T>,
  data: SchemaWithId<T>[]
): number {
  return data.findIndex((record) =>
    Object.keys(query).every((key) => query[key] === record[key])
  );
}
