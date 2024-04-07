import { writeFile } from "fs/promises";
import { data, filePath } from "./db";
import { getIndex, search, searchOne } from "./utils/queryHelpers";
import { randomUUID } from "crypto";
import { Query, SchemaWithId } from "./types";

/**
 * A class that provides a simple ORM-like interface for working with data
 * stored in a JSON database.
 *
 * @template T The type of record that this model represents.
 */
export class Model<T> {

  private indexes: Map<string, number>;

  /**
   * The array of records that make up the data for this model. Each record
   * should be an object that conforms to the `schemaWithId` interface.
   */
  private data: SchemaWithId<T>[];
  private tableName: string;

  private buildIndexes() {
    this.indexes = new Map();
    this.data.forEach((object, index) => {
      this.indexes.set(object.id, index);
    })
  }

  /**
   * Creates a new `Model` instance for a specified table. The `tableName`
   * argument should match the name of a property in the `data` object exported
   * from the database module.
   *
   * @param tableName The name of the table to create the model for.
   */
  constructor(tableName: string) {
    this.indexes = new Map();
    this.tableName = tableName;
    if (!data || !data[tableName]) {
      this.data = [];
      return;
    }
    this.data = data[tableName];
  }

  /**
   * Inserts a new record into the model's data. The record should be an object
   * that conforms to the `ModelProps` interface, and can include any properties
   * that can be represented in JSON.
   *
   * @param data The data to insert into the model.
   * @returns The `id` property of the newly inserted record.
   */
  insertOne(data: T): string {
    const id: string = randomUUID();
    this.data.push({ ...data, id });
    this.indexes.set(id, this.data.length-1);
    return id;
  }

  /**
   * Inserts multiple records into the model's data. The records should be an
   * array of objects that conform to the `ModelProps` interface, and can
   * include any properties that can be represented in JSON.
   *
   * @param data The data to insert into the model.
   */
  insertMany(data: T[]): void {
    data.forEach((record) => {
      let id: string = randomUUID();
      this.data.push({ ...record, id });
      this.indexes.set(id, this.data.length-1);
    });
  }

  /**
   * Finds a single record in the model's data that matches the provided query.
   * The query can be an object that conforms to the `ModelProps` interface, or
   * a record object that includes an `id` property.
   *
   * @param query The query to use when searching for the record.
   * @returns The first record that matches the provided query, or `undefined`
   * if no matching record is found.
   */
  findOne(query: Query<T>): SchemaWithId<T> | undefined {
    return searchOne<T>(query, this.data);
  }

  /**
   * Finds a single record in the model's data that has the specified `id`
   * property.
   */

  findById(id: string): SchemaWithId<T> | undefined {
    const index = this.indexes.get(id);
    if (index === -1) return undefined;
    return this.data[index];
  }

  /**
   * Finds all records that match the given query.
   *
   * @param query The query to be executed.
   * @returns An array of records that match the query.
   */
  findMany(query: Query<T>): SchemaWithId<T>[] {
    return search<T>(query, this.data);
  }

  /**
   * Updates the record by id.
   *
   * @param id id of the record.
   * @param data the data to be updated.
   * @returns 1 if the record exists else -1.
   */
  updateOneById(id: string, data: T): number {
    const index = this.indexes.get(id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...data };
      return 1;
    }
    return -1;
  }

  /**
   * Deletes a single record that matches the given query.
   *
   * @param data The query to be executed.
   * @returns The record that was deleted, or undefined if no records were deleted.
   */
  
  deleteOne(query: Query<T>): SchemaWithId<T> | undefined {
    const index = getIndex(query, this.data);
    if (index !== -1) {
      const [deleted] = this.data.splice(index, 1);
      this.buildIndexes();
      return deleted as SchemaWithId<T>;
    }
  }

  /**
   * Deletes a record with the given ID.
   *
   * @param id The ID of the record to be deleted.
   * @returns The record that was deleted, or undefined if no such record exists.
   */
  deleteOneById(id: string): SchemaWithId<T> | undefined {
    const index = this.indexes.get(id);
    if (index !== -1) {
      const [deleted] = this.data.splice(index, 1);
      this.buildIndexes();
      return deleted as SchemaWithId<T>;
    }
  }

  /**
   * Commits the memory changes to the actual database
   */
  async commit() {
    data[this.tableName] = this.data;
    await writeFile(filePath, JSON.stringify(data), { encoding: "utf-8" });
  }
}
