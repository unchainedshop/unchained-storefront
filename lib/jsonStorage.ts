/**
 * JSON File Storage Utilities
 * Centralized file I/O for JSON-based data storage
 */

import fs from "fs/promises";
import path from "path";

/**
 * Read and parse a JSON file
 * Returns defaultValue if file doesn't exist or parsing fails
 */
export async function readJSONFile<T>(
  filePath: string,
  defaultValue: T,
): Promise<T> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

/**
 * Write data to a JSON file
 * Creates parent directories if they don't exist
 */
export async function writeJSONFile<T>(
  filePath: string,
  data: T,
): Promise<void> {
  const contentDir = path.dirname(filePath);
  await fs.mkdir(contentDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Check if a JSON file exists
 */
export async function jsonFileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
