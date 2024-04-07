import { readFile } from "fs/promises";

export let data: any;
export let filePath: string;

export async function Init(path: string) {
  filePath = path;
  const readData = await readFile(path, { encoding: "utf-8" });
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
