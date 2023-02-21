import { writeFileSync } from "fs";
import { data, filePath } from "./db.js";
import { getIndex, search, searchOne } from "./utils/queryHelpers.js";
import { randomUUID } from "crypto";

/**
 * Defines the properties that can be used in the model. This includes all
 * basic JavaScript types, and can also contain nested properties and arrays.
 */
interface ModelProps {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | undefined
    | ModelProps
    | ModelProps[];
}

/**
 * Defines a schema with an additional `id` property that uniquely identifies
 * each record in the database.
 */
export interface schemaWithId<T> extends Record<string, unknown> {
  id: string;
  [key: string]: unknown;
}

/**
 * A class that provides a simple ORM-like interface for working with data
 * stored in a JSON database.
 *
 * @template T The type of record that this model represents. This is defined by
 * the `ModelProps` interface, and can include any properties that can be
 * represented in JSON.
 */
export class Model<T extends ModelProps> {
  /**
   * The array of records that make up the data for this model. Each record
   * should be an object that conforms to the `schemaWithId` interface.
   */
  private data: schemaWithId<T>[];
  private tableName: string;

  /**
   * Creates a new `Model` instance for a specified table. The `tableName`
   * argument should match the name of a property in the `data` object exported
   * from the database module.
   *
   * @param tableName The name of the table to create the model for.
   */
  constructor(tableName: string) {
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
  findOne(query: T | schemaWithId<T>): schemaWithId<T> | undefined {
    return searchOne<T, schemaWithId<T>>(query, this.data);
  }

  /**
   * Finds a single record in the model's data that has the specified `id`
   * property.
   */

  findById(id: string): schemaWithId<T> {
    return this.data.find((value) => value.id == id);
  }

  /**
   * Finds all records that match the given query.
   *
   * @param query The query to be executed.
   * @returns An array of records that match the query.
   */
  findMany(query: T | schemaWithId<T>): schemaWithId<T>[] {
    return search<T, schemaWithId<T>>(query, this.data);
  }

  /**
   * Deletes a single record that matches the given query.
   *
   * @param data The query to be executed.
   * @returns The record that was deleted, or undefined if no records were deleted.
   */
  deleteOne(query: T | schemaWithId<T>): schemaWithId<T> | undefined {
    const index = getIndex(query, this.data);
    if (index !== -1) {
      const [deleted] = this.data.splice(index, 1);
      return deleted as schemaWithId<T>;
    }
  }

  /**
   * Deletes a record with the given ID.
   *
   * @param id The ID of the record to be deleted.
   * @returns The record that was deleted, or undefined if no such record exists.
   */
  deleteOneById(id: string): schemaWithId<T> | undefined {
    const index = getIndex({ id }, this.data);
    if (index !== -1) {
      const [deleted] = this.data.splice(index, 1);
      return deleted as schemaWithId<T>;
    }
  }
  /**
   * Commits the memory changes to the actual database
   */
  commit() {
    data[this.tableName] = this.data;
    writeFileSync(filePath, JSON.stringify(data), { encoding: "utf-8" });
  }
}
