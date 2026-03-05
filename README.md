# json-schema-testgen

Generate test files from the official [JSON-Schema-Test-Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite) for validating JSON Schema implementations.

Currently generates TypeScript tests for [Bun](https://bun.sh). Multi-language support is planned.

## Setup

```bash
bun install
git submodule update --init   # fetch the official test suite
bun run build-data            # embed test data into src/test-data.ts
```

## Generating tests

```bash
# Generate required tests for all drafts
bun run generate

# Generate only specific drafts
bun run generate -- --drafts draft7,draft2020-12

# Include optional tests
bun run generate -- --include-optional

# Custom output directory
bun run generate -- --output ./my-tests

# Show all options
bun run generate -- --help
```

## Plugging in your validator

Edit `setup.ts` to wire up your JSON Schema validator:

```ts
import { setValidator } from "./src/adapter.ts";

setValidator((schema, data, draft) => {
  // Return { valid: boolean, errors?: string[] }
  // `draft` is e.g. "draft7", "draft2020-12"
  const result = myValidator.validate(schema, data);
  return { valid: result.valid, errors: result.errors };
});
```

Then run:

```bash
bun test
```

## Supported drafts

- `draft3`
- `draft4`
- `draft6`
- `draft7`
- `draft2019-09`
- `draft2020-12`

## Test output

Generated tests show verbose details on failure:

```
Schema: {
  "type": "integer"
}
Data:   1.1
Expected: invalid
Got:      valid
Errors: type mismatch: expected integer
```

## Rebuilding test data

When the upstream test suite updates:

```bash
cd official-tests && git pull origin main && cd ..
bun run build-data
bun run generate
```
