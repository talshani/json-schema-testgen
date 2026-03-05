import { setValidator } from "./src/adapter.ts";

// Plug in your validator implementation here.
// The `draft` parameter is a string like "draft2020-12" so you can
// route to the correct dialect.
//
// Return { valid: boolean, errors?: string[] }.
// The errors array is optional — if provided, error details will be
// shown in the test output on failure.
//
// If your implementation needs remote schema resolution,
// configure it here (e.g. mapping http://localhost:1234/* to official-tests/remotes/).
setValidator((schema, data, draft) => {
  throw new Error("TODO: plug in your validator");
});
