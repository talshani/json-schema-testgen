import { parseArgs } from "node:util";
import { join } from "path";
import { generateTests } from "./generate-tests.ts";

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    drafts: { type: "string" },
    "include-optional": { type: "boolean", default: false },
    output: { type: "string" },
    help: { type: "boolean", default: false },
  },
});

if (values.help) {
  console.log(`Usage: bun src/cli.ts [options]

Options:
  --drafts <list>       Comma-separated drafts to include
                        (default: all — draft3,draft4,draft6,draft7,draft2019-09,draft2020-12)
  --include-optional    Include optional tests (default: false)
  --output <dir>        Output directory (default: ./generated-tests)
  --help                Show this help message
`);
  process.exit(0);
}

const drafts = values.drafts
  ? values.drafts.split(",").map((d) => d.trim())
  : undefined;

generateTests({
  drafts,
  includeOptional: values["include-optional"],
  outputDir: values.output
    ? join(process.cwd(), values.output)
    : undefined,
});
