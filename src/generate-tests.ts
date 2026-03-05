import { join, relative, sep, dirname } from "path";
import { rmSync, mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { testData, type TestGroup } from "./test-data.ts";

export type TestRunner = "bun" | "vitest" | "jest";

export interface GenerateOptions {
  drafts?: string[];
  includeOptional?: boolean;
  outputDir?: string;
  runner?: TestRunner;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const ADAPTER_DTS = `type ValidateResult = { valid: boolean; errors?: string[] };
type ValidateFn = (schema: unknown, data: unknown, draft: string) => ValidateResult;

declare global {
  var __jsonSchemaTestgenValidate: ValidateFn;
}

export {};
`;

function testImportLine(runner: TestRunner): string {
  switch (runner) {
    case "bun":
      return `import { describe, test, expect } from "bun:test";\n`;
    case "vitest":
      return `import { describe, test, expect } from "vitest";\n`;
    case "jest":
      return "";
  }
}

export function generateTests(options: GenerateOptions = {}) {
  const {
    drafts = Object.keys(testData),
    includeOptional = false,
    outputDir = join(__dirname, "..", "generated-tests"),
    runner = "bun",
  } = options;

  // Clean output directory
  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(outputDir, { recursive: true });

  // Write adapter type declaration at output root
  writeFileSync(join(outputDir, "adapter.d.ts"), ADAPTER_DTS);

  let totalFiles = 0;

  for (const draft of drafts) {
    const draftData = testData[draft];
    if (!draftData) {
      console.warn(`Unknown draft: ${draft}`);
      continue;
    }

    let draftCount = 0;

    for (const [key, groups] of Object.entries(draftData)) {
      const isOptional = key.startsWith("optional/") || key.startsWith("optional\\");
      if (isOptional && !includeOptional) continue;

      const outFile = join(outputDir, draft, key + ".test.ts");
      const outDir = join(outFile, "..");
      mkdirSync(outDir, { recursive: true });

      const adapterRelPath = relative(outDir, join(outputDir, "adapter.d.ts")).split(sep).join("/");
      const stem = key.split("/").pop()!;

      let code = `// Auto-generated test file\n`;
      code += `/// <reference path="${adapterRelPath}" />\n`;
      code += testImportLine(runner);
      code += `const validate = globalThis.__jsonSchemaTestgenValidate;\n\n`;
      code += `const draft = ${JSON.stringify(draft)};\n\n`;
      code += `describe(${JSON.stringify(stem)}, () => {\n`;

      for (const group of groups) {
        const groupDesc = JSON.stringify(group.description);
        const schemaStr = JSON.stringify(group.schema);

        code += `  describe(${groupDesc}, () => {\n`;
        code += `    const schema = ${schemaStr};\n\n`;

        for (const tc of group.tests) {
          const testDesc = JSON.stringify(tc.description);
          const dataStr = JSON.stringify(tc.data);
          const expected = tc.valid;
          const expectedLabel = expected ? "valid" : "invalid";
          const gotLabel = expected ? "invalid" : "valid";

          code += `    test(${testDesc}, () => {\n`;
          code += `      const data = ${dataStr};\n`;
          code += `      const result = validate(schema, data, draft);\n\n`;
          code += `      if (result.valid !== ${expected}) {\n`;
          code += `        const detail = [\n`;
          code += `          \`Schema: \${JSON.stringify(schema, null, 2)}\`,\n`;
          code += `          \`Data:   \${JSON.stringify(data, null, 2)}\`,\n`;
          code += `          \`Expected: ${expectedLabel}\`,\n`;
          code += `          \`Got:      ${gotLabel}\`,\n`;
          code += `          result.errors?.length ? \`Errors: \${result.errors.join("; ")}\` : "",\n`;
          code += `        ].filter(Boolean).join("\\n");\n`;
          code += `        throw new Error(detail);\n`;
          code += `      }\n`;
          code += `    });\n\n`;
        }

        code += `  });\n\n`;
      }

      code += `});\n`;

      writeFileSync(outFile, code);
      draftCount++;
    }

    console.log(`${draft}: ${draftCount} test files`);
    totalFiles += draftCount;
  }

  console.log(`\nTotal: ${totalFiles} test files generated in ${outputDir}`);
}
