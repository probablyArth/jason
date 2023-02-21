import { Init, Model } from "../src/index";
import { expect, describe, it } from "@jest/globals";
import { writeFileSync } from "fs";

const setupDB = () => {
  writeFileSync("testDB.json", "");
  Init("testDB.json");
  const tableName = "testTable";
  const model = new Model<{ name?: string }>(tableName);
  return model;
};

describe("Model", () => {
  describe("insertOne", () => {
    const model = setupDB();
    it("should insert a record into the data", () => {
      const record = { name: "John Doe" };
      const id = model.insertOne(record);
      expect(model.findById(id)).toEqual({ id, ...record });
    });
  });

  describe("insertMany", () => {
    const model = setupDB();
    it("should insert multiple records into the data", () => {
      const records = [
        { name: "John Doe" },
        { name: "Jane Doe" },
        { name: "John Dough" },
      ];
      model.insertMany(records);
      expect(model.findMany({})).toEqual([
        ...records.map((record) => ({ ...record, id: expect.any(String) })),
      ]);
    });
  });

  describe("updateOne", () => {
    const model = setupDB();
    it("should update a record in the data", () => {
      const record = { name: "John Doe" };
      const id = model.insertOne(record);
      model.updateOneById(id, { name: "Not John Doe" });
      expect(model.findById(id)).toEqual({ id, name: "Not John Doe" });
    });
  });

  describe("findOne", () => {
    const model = setupDB();
    it("should return undefined when no matching record is found", () => {
      const result = model.findOne({ name: "John Dough" });
      expect(result).toBeUndefined();
    });

    it("should return the matching record when one is found", () => {
      const record = { name: "John Doe" };
      const id = model.insertOne(record);
      const result = model.findOne({ id });
      expect(result).toEqual({ id, ...record });
    });
  });

  describe("findById", () => {
    const model = setupDB();
    it("should return the undefined when no matching record is found", () => {
      const result = model.findById("123");
      expect(result).toBeUndefined();
    });

    it("should return the matching record for the id", () => {
      const id = model.insertOne({ name: "Ultra pro max" });
      const result = model.findById(id);
      expect(result).toEqual({ id, name: "Ultra pro max" });
    });
  });

  describe("findMany", () => {
    const model = setupDB();
    it("should return an array of records", () => {
      const records = [
        { name: "John Doe" },
        { name: "Jane Doe" },
        { name: "John Dough" },
      ];
      model.insertMany(records);
      expect(model.findMany({})).toEqual([
        ...records.map((record) => ({ ...record, id: expect.any(String) })),
      ]);
    });
  });
});
