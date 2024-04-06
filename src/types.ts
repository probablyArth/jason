export type SchemaWithId<T> = T & { id: string };
export type Query<T> = Partial<SchemaWithId<T>>;