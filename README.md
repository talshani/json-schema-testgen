# json-schema-testgen

Generate test files from the official [JSON-Schema-Test-Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite) for validating JSON Schema implementations.

Supports generating tests for [Bun](https://bun.sh), [Vitest](https://vitest.dev), and [Jest](https://jestjs.io).

## Usage

```bash
# With npx
npx json-schema-testgen --help

# With bunx
bunx json-schema-testgen --help
```

## Generating tests

```bash
# Generate required tests for all drafts (default runner: bun)
npx json-schema-testgen

# Generate tests for vitest or jest
npx json-schema-testgen --runner vitest
npx json-schema-testgen --runner jest

# Generate only specific drafts
npx json-schema-testgen --drafts draft7,draft2020-12

# Include optional tests
npx json-schema-testgen --include-optional

# Custom output directory
npx json-schema-testgen --output ./my-tests
```

## CLI options

| Option | Description | Default |
|---|---|---|
| `--runner <runner>` | Test runner: `bun`, `vitest`, `jest` | `bun` |
| `--drafts <list>` | Comma-separated drafts to include | all drafts |
| `--include-optional` | Include optional tests | `false` |
| `--output <dir>` | Output directory | `./generated-tests` |
| `--version` | Show version | |
| `--help` | Show help message | |

## Plugging in your validator

Create a setup file that calls `setValidator` before tests run:

```ts
import { setValidator } from "json-schema-testgen";

setValidator((schema, data, draft) => {
  // Return { valid: boolean, errors?: string[] }
  // `draft` is e.g. "draft7", "draft2020-12"
  const result = myValidator.validate(schema, data);
  return { valid: result.valid, errors: result.errors };
});
```

How you preload the setup file depends on the runner:

- **Bun** — add `preload = ["./setup.ts"]` to `bunfig.toml`, then `bun test`
- **Vitest** — add `setupFiles: ["./setup.ts"]` to your vitest config, then `vitest`
- **Jest** — add `setupFilesAfterFramework: ["./setup.ts"]` to your jest config, then `jest`

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

## Development

```bash
bun install
git submodule update --init   # fetch the official test suite
bun run build-data            # embed test data into src/test-data.ts
```

To update when the upstream test suite changes:

```bash
cd official-tests && git pull origin main && cd ..
bun run build-data
```
