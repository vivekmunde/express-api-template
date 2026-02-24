/**
 * Aggregates multiple Prisma schema files from `schema/` into a single
 * `prisma/schema.prisma` file. Reads all `.prisma` files in order (base first,
 * then alphabetically), concatenates their contents with double newlines, and
 * writes the result to the target path. Ensures the target directory exists
 * before writing.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "path";

/** Directory containing the source Prisma schema fragments (e.g. schema/). */
const PRISMA_SCHEMA_DIR = join(__dirname, "../schema");
/** Filename of the base schema (generator + datasource); must be listed first. */
const BASE_SCHEMA_FILE = "base.prisma";
/** Output path for the merged schema used by Prisma CLI (e.g. prisma/schema.prisma). */
const TARGET_SCHEMA_PATH = join(__dirname, "../prisma/schema.prisma");

try {
  // Ensure target directory exists so writeFileSync does not fail
  const targetDir = dirname(TARGET_SCHEMA_PATH);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  // Collect .prisma files and sort so base schema is first, then alphabetical
  const schemaFiles = readdirSync(PRISMA_SCHEMA_DIR)
    .filter((file) => file.endsWith(".prisma"))
    .sort((a, b) => {
      if (a === BASE_SCHEMA_FILE) return -1;
      if (b === BASE_SCHEMA_FILE) return 1;
      return a.localeCompare(b);
    });

  if (!schemaFiles.includes(BASE_SCHEMA_FILE)) {
    throw new Error(
      `Base schema file '${BASE_SCHEMA_FILE}' not found in ${PRISMA_SCHEMA_DIR}`
    );
  }

  // Read each file (trimmed) and join with double newlines
  const mergedSchema = schemaFiles
    .map((file) => {
      const content = readFileSync(
        join(PRISMA_SCHEMA_DIR, file),
        "utf8"
      ).trim();
      return content;
    })
    .join("\n\n");

  writeFileSync(TARGET_SCHEMA_PATH, mergedSchema, "utf8");
} catch (error) {
  console.error("Error while merging schema files:", error);
  process.exit(1);
}
