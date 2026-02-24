# express-api-template

Starter template for an AI-first architected API using the Express.js tech stack (Express, TypeScript).

## Prerequisites

- **Node.js** >= 22.0.0
- **Yarn** (package manager)

## Setup

1. Clone the repository and install dependencies:

```bash
yarn install
```

2. Copy the example env file and set variables:

```bash
cp .env.example .env
```

Edit `.env` and set at least:

| Variable   | Description                   |
| ---------- | ----------------------------- |
| `PORT`     | HTTP port (e.g. `5050`)       |
| `NODE_ENV` | `development` or `production` |

3. Run the server:

```bash
yarn dev
```

The server listens on the configured `PORT`. Root and health endpoints are available (see below).

## Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `yarn dev`          | Start dev server with hot reload        |
| `yarn build`        | Compile TypeScript to `dist/`           |
| `yarn start`        | Run compiled app (`node dist/index.js`) |
| `yarn typecheck`    | Type-check without emitting             |
| `yarn lint`         | Run ESLint on `src/`                    |
| `yarn format`       | Format with Prettier                    |
| `yarn format:check` | Check formatting only                   |
