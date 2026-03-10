---
name: express-routes
description: Defines Express route layout (one dir per resource and method), handler wrapping (public/protected), file responsibilities, schema/validation/query/mutation conventions, and response typing. Use when adding or changing routes under src/routes, defining controllers, schemas, validators, or route handlers.
---

# Express Routes

Apply this skill when working under **`src/routes`**: adding routes, controllers, schemas, validation, queries, or mutations.

## When to use

- Adding a new resource or HTTP method
- Implementing or refactoring a route handler, controller, or index
- Defining schema types, Zod validation, or response bodies
- Writing or reviewing query.ts / mutation.ts

## Quick reference

| Concern        | Rule                                                                                                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Location**   | All routes under `src/routes`; one directory per resource, one per method (e.g. `users/get/`, `users/post/`).                                                                                                                 |
| **Paths**      | Nest by path; use `{paramName}` for dynamic segments (e.g. `users/{id}/get/` → `GET /users/:id`).                                                                                                                             |
| **Handlers**   | Every route uses a **named controller**; wrap in `publicRouteHandler` or `protectedRouteHandler`, or pass controller directly for no-context routes (e.g. health).                                                            |
| **Response**   | Use `TResponseBody<TResponseData, TResponseErrorCode>` and `STATUS_CODES` from `@/constants/status-codes`; no numeric status literals.                                                                                        |
| **Files**      | `index.ts` = router + handler registration; `controller.ts` = validation → query/mutation → transform → response; `schema.ts`, `validation.ts` (Zod), `query.ts`, `mutation.ts`, `transformation.ts`, `utility.ts` as needed. |
| **Naming**     | Controllers: `getUsersController`, `postUserController`. Schema: `TGetUsersResponseData`, `TPostUserRequestData`, `*ResponseErrorCode` extending `TResponseErrorCode`. Queries: `get*Query`; mutations: `post*Mutation`, etc. |
| **Validation** | Zod in `validation.ts`; shape/type only; return format compatible with `TResponseBody` validationErrors.                                                                                                                      |
| **Data**       | Prefer `undefined` over `null`; timestamps in UTC milliseconds (number).                                                                                                                                                      |

## Handler wrapping

- **Public** (optional auth): `publicRouteHandler(controller)` from `@/route-handlers/public-route-handler`; controller gets `(req, res, context)` with `TPublicRouteRequestContext`.
- **Protected** (auth required): `protectedRouteHandler(controller)` from `@/route-handlers/protected-route-handler`; 401 if no session; `TProtectedRouteRequestContext` with required `sessionUser`.
- **No context** (e.g. health): pass controller directly; signature `(req, res) => Promise<Response>`.

## Controller

- Name: method + resource + `Controller` (e.g. `getUsersController`).
- Signature: `(req, res)` (or `(req, res, context)` when wrapped). Return type: `Promise<Response>`.
- Build `responseBody: TResponseBody<TResponseData, TResponseErrorCode>` then `return res.json(responseBody)`.

## Schema & validation

- Response/request/error types in `schema.ts`. Error code type extends `TResponseErrorCode`. List responses use `TModelCollection<T>`.
- Validation in `validation.ts` with Zod; align with schema types (e.g. `z.infer<typeof schema>`).

## Query & mutation

- `query.ts`: get-only Prisma; name `get*Query`. `mutation.ts`: write-only Prisma; name `post*Mutation`, `put*Mutation`, etc. No business logic inside; controller interprets results.

## Scope

- Keep route code **route-specific**. Shared logic lives outside `src/routes`.

## Full reference

For complete rules, examples, and file-responsibility table, see [reference.md](reference.md).
