import { readFileSync } from "fs";

export let data: any;
export let filePath: string;

export function Init(path: string) {
  filePath = path;
  const readData = readFileSync(path, { encoding: "utf-8" });
  if (readData == "") {
    data = {};
    return;
  }
  try {
    data = JSON.parse(readData);
  } catch (e) {
    throw Error("Corrupt database!" + "\n" + e.message);
  }
}
