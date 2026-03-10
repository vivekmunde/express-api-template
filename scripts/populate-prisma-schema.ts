/**
 * Populates `prisma/schema.prisma` by merging Prisma schema fragments from
 * `schema/`. Reads all `.prisma` files (base first, then alphabetically),
 * concatenates their contents with double newlines, and writes the result to
 * the target path. Creates the target directory if it does not exist.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "node:path";

/** Directory containing the source Prisma schema fragments (e.g. schema/). */
const PRISMA_SCHEMA_DIR = join(import.meta.dirname, "../schema");
/** Base schema file (generator + datasource); included first in the merge. */
const BASE_SCHEMA_FILE = "base.prisma";
/** Output path for the merged schema used by the Prisma CLI. */
const TARGET_SCHEMA_PATH = join(import.meta.dirname, "../prisma/schema.prisma");

try {
  const targetDir = dirname(TARGET_SCHEMA_PATH);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

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
