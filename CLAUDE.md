
# json-schema-testgen

CLI tool that generates test files from the official [JSON-Schema-Test-Suite](https://github.com/json-schema-org/JSON-Schema-Test-Suite). Currently generates TypeScript (Bun) tests; multi-language support planned.

## Project structure

- `src/build-test-data.ts` — reads JSON from `official-tests/` submodule, writes `src/test-data.ts`
- `src/test-data.ts` — **generated** (gitignored) — all test cases embedded as TS
- `src/cli.ts` — CLI entry point with flag parsing
- `src/generate-tests.ts` — generates `.test.ts` files from embedded data
- `src/adapter.ts` — `ValidateFn` type and `validate()` / `setValidator()` exports
- `setup.ts` — Bun test preload; user plugs in their validator here
- `generated-tests/` — **generated** (gitignored) — output test files

## Scripts

- `bun run build-data` — rebuild `src/test-data.ts` from the submodule
- `bun run generate` — generate test files (see `--help` for flags)
- `bun test` — run generated tests (requires validator in `setup.ts`)

## Conventions

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install`
- Use `bun run <script>` instead of `npm run <script>`
- Use `bunx <package>` instead of `npx <package>`
- Prefer `Bun.file` over `node:fs` readFile/writeFile
