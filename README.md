# express-api-template

Starter template for an AI-first architected API using the Express.js tech stack (Express, TypeScript).

## Prerequisites

- **Node.js** >= 22.0.0
- **Yarn** (package manager)
- **MongoDB** (for the database)

## Setup

1. Clone the repo and install dependencies:

```bash
yarn install
```

2. Copy the example env and set variables:

```bash
cp .env.example .env
```

Edit `.env` and configure at least:

| Variable          | Description                                 |
| ----------------- | ------------------------------------------- |
| `PORT`            | HTTP port (e.g. `5050`)                     |
| `NODE_ENV`        | `development` or `production`               |
| `DATABASE_URL`    | MongoDB connection URL (see `.env.example`) |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins (optional)     |

3. Start the dev server:

```bash
yarn dev
```

The server listens on the configured `PORT`. Root and health endpoints are available.

## Prisma

The app uses **Prisma** with **MongoDB**.

- **Schema source**: Schema is split into fragments under `schema/`. `schema/base.prisma` defines the generator and datasource; other `.prisma` files add models and enums.
- **Generated schema**: The single file used by Prisma CLI is `prisma/schema.prisma`. It is produced by aggregating all `.prisma` files from `schema/` (base first, then alphabetically). Do not edit `prisma/schema.prisma` by hand; run the aggregate script or `prisma:generate` instead.
- **Client**: After schema changes, run `yarn prisma:generate` to regenerate the Prisma client. The `dev` and `build` scripts run this automatically.
- **Database**: Set `DATABASE_URL` in `.env`. Use `yarn prisma:push` to push the current schema to the database (no migrations with MongoDB).

## Scripts

Scripts under `scripts/` are used at startup and by npm scripts:

| Script                               | Purpose                                                                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/aggregate-prisma-schema.ts` | Merges all `.prisma` files from `schema/` into `prisma/schema.prisma`. Runs as part of `prisma:generate` and thus before `dev` and `build`. |

## Run scripts (package.json)

| Command                 | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `yarn dev`              | Start dev server with hot reload (runs `prisma:generate` then `tsx watch src/index.ts`) |
| `yarn build`            | Run `prisma:generate`, lint, compile TypeScript to `dist/`, resolve path aliases        |
| `yarn start`            | Run compiled app (`node dist/index.js`)                                                 |
| `yarn typecheck`        | Type-check without emitting                                                             |
| `yarn lint`             | Run ESLint on `src/`                                                                    |
| `yarn format`           | Format with Prettier                                                                    |
| `yarn format:check`     | Check formatting only                                                                   |
| `yarn prisma:aggregate` | Aggregate `schema/*.prisma` into `prisma/schema.prisma`                                 |
| `yarn prisma:generate`  | Aggregate schema then run `prisma generate`                                             |
| `yarn prisma:push`      | Push schema to the database (`prisma db push`)                                          |
