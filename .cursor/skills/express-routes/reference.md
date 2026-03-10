# Routes — Full Reference

Source: project rules (`.cursor/rules/2-routes.mdc`). Use when you need exact wording, examples, or the full file-responsibility table.

## Location & layout

- Define every route under **`src/routes`**.
- Use **one directory per resource** (e.g. `users`, `roles`) and **one per HTTP method** (`get`, `post`, `put`, `patch`, `delete`) under it (e.g. `users/get/`, `users/post/`).
- Each resource has an **`index.ts`** at its root that defines path(s) and registers the controller for each method.
- Nest by path: use subdirs for path segments (e.g. `users/{id}/get/` for `GET /users/:id`). Directory names must match the path (e.g. `users` → `{id}` → `get`).
- Use **`{paramName}`** for dynamic segments and match the path param (e.g. `{id}` for `:id`, `{slug}` for `:slug`).

## Route handlers

- **Route handlers are required for all routes.** Every route must register a **route handler** (a named controller or a wrapper that invokes it). Do not use inline or anonymous functions.
- In **`index.ts`**, import the controller from the method's `controller.ts` and pass it to the Router as the handler (wrapped in **`publicRouteHandler`** or **`protectedRouteHandler`**; see below).

### Public and protected route handlers

- **Public routes** (no auth required): wrap the controller in **`publicRouteHandler`** from `@/route-handlers/public-route-handler`. The controller receives `(req, res, context)` where `context` is **`TPublicRouteRequestContext`** (e.g. optional `sessionUser`). Use for routes that work for both unauthenticated and authenticated callers.
- **Protected routes** (auth required): wrap the controller in **`protectedRouteHandler`** from `@/route-handlers/protected-route-handler`. The handler ensures a valid session and returns 401 if missing; the controller receives `(req, res, context)` where `context` is **`TProtectedRouteRequestContext`** with required `sessionUser`. Use for routes that must be authenticated.
- **Routes that need no request context** (e.g. health): pass the controller directly to the Router; the controller has signature `(req, res) => Promise<Response>`.

**Public route example:**

```ts
import { publicRouteHandler } from "@/route-handlers/public-route-handler";
import { Router } from "express";
import { getAuthenticationSessionController } from "./get/controller";

const authenticationRoutes = Router();
authenticationRoutes.get(
  "/authentication/session",
  publicRouteHandler(getAuthenticationSessionController)
);

export { authenticationRoutes };
```

**Protected route example:**

```ts
import { protectedRouteHandler } from "@/route-handlers/protected-route-handler";
import { Router } from "express";
import { getProfileController } from "./get/controller";

const profileRoutes = Router();
profileRoutes.get("/profile", protectedRouteHandler(getProfileController));

export { profileRoutes };
```

### Example: registering route handlers (no context)

```ts
import { Router } from "express";
import { getHealthController } from "./get/controller";

const healthRoutes = Router();
healthRoutes.get("/health", getHealthController);

export { healthRoutes };
```

## Example directory structure

```
src/routes/
  health/
    index.ts       → defines GET /health (and other methods if added)
    get/
      controller.ts
  users/
    index.ts       → defines GET /users, POST /users, etc.
    get/
      controller.ts
      schema.ts
      validation.ts
      query.ts
      ...
    post/
      controller.ts
      schema.ts
      validation.ts
      mutation.ts
      ...
    {id}/
      get/         → GET /users/:id
      put/         → PUT /users/:id
      delete/      → DELETE /users/:id
```

## Response shape

- Use **`TResponseBody<TData, TErrorCode>`** from `@/types/response-body` for every route response. Controllers send `res.json(body)` where `body` conforms (success: `data`; validation: `validationErrors`; error: `error`).
- **Type the response body explicitly**: assign it to a variable of type **`TResponseBody<TResponseData, TResponseErrorCode>`**, then `return res.json(responseBody)`.
- Use **`STATUS_CODES`** from `@/constants/status-codes` whenever setting `res.status(...)`; do not use numeric literals.

## File responsibilities

| File                | Responsibility                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index.ts`          | Create Router, define path(s), register each method's **route handler** (controller or wrapper); no business logic.                                    |
| `controller.ts`     | Export the route handler; orchestrate validation → query/mutation → transformation → response; send response via `TResponseBody`; minimal wiring only. |
| `schema.ts`         | Define all public schema types for the route (request/response shapes, error codes).                                                                   |
| `validation.ts`     | Schema validation using **Zod**: validate request body, query, or params against schema types; return validation result or errors.                     |
| `query.ts`          | Prisma get queries only; return raw result; no business logic.                                                                                         |
| `mutation.ts`       | Prisma post/put/patch/delete only; return raw result; no business logic; no get queries unless required by the mutation.                               |
| `transformation.ts` | Data transformations for route response only.                                                                                                          |
| `utility.ts`        | Route-specific helpers only.                                                                                                                           |

## Controller

- **Naming**: method + resource + **`Controller`** (e.g. `getUsersController`, `postUserController`, `putUserController` for `users/{id}/put/`).
- **Signature**: exactly two arguments — **`req`** (`Request`) and **`res`** (`Response`).
- **Return type**: **`Promise<Response>`**. Return the result of the response send (e.g. `return res.json(responseBody)`).
- **Response**: define **`responseBody`** as **`TResponseBody<TResponseData, TResponseErrorCode>`**, then `return res.json(responseBody)`.

### Response body example

**Success:**

```ts
const responseBody: TResponseBody<TResponseData, TResponseErrorCode> = {
  data: {
    name: "ABC",
    // ...
  },
};
return res.json(responseBody);
```

**Error (with code):**

```ts
const responseBody: TResponseBody<TResponseData, TResponseErrorCode> = {
  error: {
    code: "USER_EXISTS",
    message: t("errors.USER_EXISTS"),
  },
};
return res.json(responseBody);
```

## Schema types

- **Response data**: prefix with method (`Get`|`Post`|`Put`|`Patch`|`Delete`), suffix **`ResponseData`** (e.g. `TGetUsersResponseData`). This is the first generic in **`TResponseBody<TData, TErrorCode>`**.
- **Request data**: prefix with method, suffix **`RequestData`** (e.g. `TPostUserRequestData`).
- **Error codes**: suffix **`ResponseErrorCode`**; **always extend** **`TResponseErrorCode`** from `@/types/response-error-code` (e.g. `TGetUsersResponseErrorCode = TResponseErrorCode` or `TPostUserResponseErrorCode = TResponseErrorCode | "USER_EXISTS"`). This is the second generic in **`TResponseBody`**. Do not define a response error code type that does not extend **`TResponseErrorCode`**.
- **List responses**: use **`TModelCollection`** from `@/types/model-collection` for a consistent list schema.

### Schema example

```ts
import { TResponseErrorCode } from "@/types/response-error-code";
import { TModelCollection } from "@/types/model-collection";

export type TGetUser = {
  id: string;
  name?: string;
  email: string;
  roles?: { id: string; name: string }[];
};

export type TGetUsersResponseData = TModelCollection<TGetUser>;
export type TGetUsersResponseErrorCode = TResponseErrorCode;
```

```ts
import { TResponseErrorCode } from "@/types/response-error-code";

export type TPostUserRequestData = { email: string; roleIds: string[] };
export type TPostUserResponseData = {
  id: string;
  email: string;
  roleIds: string[];
};
export type TPostUserResponseErrorCode = TResponseErrorCode | "USER_EXISTS";
```

## Validation

- Use **`validation.ts`** for schema validation of request data (body, query, params). The controller calls the validator before query/mutation.
- **Use Zod**: define schemas with **Zod** (e.g. `z.object()`, `z.string()`) and use `.safeParse()` or `.parse()`; do not use other validation libraries in route validators.
- **Naming**: prefix with method + resource, suffix **`Validation`** or **`Validator`** (e.g. `postUserRequestValidation`, `getUsersQueryValidation`). Export a function that accepts raw input and returns a validation result (e.g. parsed data or validation errors).
- **Single responsibility**: validate shape and types only; do not run business rules or DB checks. Return **validation errors** in the format expected by **`TResponseBody`** (e.g. `validationErrors`) so the controller can set status and response body.
- **Align with schema types**: validation must align with **`schema.ts`** (request types). Prefer inferring TypeScript types from Zod schemas (e.g. `z.infer<typeof schema>`) where it keeps schema and types in sync.

## Query & mutation

- **query.ts**: prefix **`get`**, suffix **`Query`** (e.g. `getUsersQuery`, `getRoleQuery`). No mutations.
- **mutation.ts**: prefix **`post`**|**`put`**|**`patch`**|**`delete`**, suffix **`Mutation`** (e.g. `postUserMutation`, `putRoleMutation`).
- **No logic in query/mutation**: these files only perform the Prisma call and return its result. Do not add conditionals, validation, or business rules (e.g. do not check expiry and return `undefined` in the query; do that in the controller or a shared utility). The controller interprets the result and chooses the response.

## Return values

- Prefer **`undefined`** over **`null`** for optional or absent values in controller response data and in transformation results.
- In **query.ts** and **mutation.ts**, return **`undefined`** when a value is absent (e.g. no row found).
- In **schema.ts** types, use **`undefined`** for optional or absent properties (e.g. `field?: T` or `field: T | undefined`), not **`null`**.

## Timestamps

- All timestamp values in route **schemas**, **responses**, and **request payloads** must be in **UTC milliseconds** (number). Use UTC ms only; convert to/from `Date` or other formats at the boundary (e.g. in controller or transformation) when needed.

## Transformation

- Prefix transformation functions with **`transform`** (e.g. `transformUsersResponse`).

## Scope

- Keep all route members **route-specific**. Do not share code between routes; move common logic to shared modules outside **`src/routes`**.
