/**
 * Prisma client singleton for database access.
 * Use this instance for all Prisma queries and mutations.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };
