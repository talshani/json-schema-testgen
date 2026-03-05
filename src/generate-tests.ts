import { join, relative, sep } from "path";
import { rmSync, mkdirSync } from "fs";
import { testData, type TestGroup } from "./test-data.ts";

export interface GenerateOptions {
  drafts?: string[];
  includeOptional?: boolean;
  outputDir?: string;
}

export function generateTests(options: GenerateOptions = {}) {
  const {
    drafts = Object.keys(testData),
    includeOptional = false,
    outputDir = join(import.meta.dir, "..", "generated-tests"),
  } = options;

  // Clean output directory
  rmSync(outputDir, { recursive: true, force: true });

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

      // Compute relative path from outDir to src/adapter.ts
      const relToRoot = relative(outDir, join(import.meta.dir, ".."));
      const adapterImport = relToRoot.split(sep).join("/") + "/src/adapter.ts";

      const stem = key.split("/").pop()!;

      let code = `// Auto-generated test file\n`;
      code += `import { describe, test, expect } from "bun:test";\n`;
      code += `import { validate } from "${adapterImport}";\n\n`;
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
          code += `        expect.unreachable(detail);\n`;
          code += `      }\n`;
          code += `    });\n\n`;
        }

        code += `  });\n\n`;
      }

      code += `});\n`;

      Bun.write(outFile, code);
      draftCount++;
    }

    console.log(`${draft}: ${draftCount} test files`);
    totalFiles += draftCount;
  }

  console.log(`\nTotal: ${totalFiles} test files generated in ${outputDir}`);
}

// Allow direct execution
if (import.meta.main) {
  generateTests();
}
