#!/usr/bin/env node
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { generateTests, type TestRunner } from "./generate-tests.ts";
import { packageVersion, testSuiteCommit } from "./test-data.ts";

const RUNNERS = ["bun", "vitest", "jest"] as const;

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    drafts: { type: "string" },
    runner: { type: "string" },
    "include-optional": { type: "boolean", default: false },
    output: { type: "string" },
    help: { type: "boolean", default: false },
    version: { type: "boolean", default: false },
  },
});

if (values.version) {
  console.log(`${packageVersion}`);
  console.log(`test-suite: ${testSuiteCommit} (https://github.com/json-schema-org/JSON-Schema-Test-Suite/tree/${testSuiteCommit})`);
  process.exit(0);
}

if (values.help) {
  console.log(`Usage: json-schema-testgen [options]

Options:
  --drafts <list>       Comma-separated drafts to include
                        (default: all — draft3,draft4,draft6,draft7,draft2019-09,draft2020-12)
  --runner <runner>     Test runner: bun, vitest, jest (default: bun)
  --include-optional    Include optional tests (default: false)
  --output <dir>        Output directory (default: ./generated-tests)
  --version             Show version
  --help                Show this help message
`);
  process.exit(0);
}

const runner = (values.runner ?? "bun") as TestRunner;
if (!RUNNERS.includes(runner)) {
  console.error(`Unknown runner: ${runner}. Must be one of: ${RUNNERS.join(", ")}`);
  process.exit(1);
}

const drafts = values.drafts
  ? values.drafts.split(",").map((d) => d.trim())
  : undefined;

generateTests({
  drafts,
  runner,
  includeOptional: values["include-optional"],
  outputDir: values.output
    ? resolve(values.output)
    : undefined,
});
