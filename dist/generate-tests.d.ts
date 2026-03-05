export type TestRunner = "bun" | "vitest" | "jest";
export interface GenerateOptions {
    drafts?: string[];
    includeOptional?: boolean;
    outputDir?: string;
    runner?: TestRunner;
}
export declare function generateTests(options?: GenerateOptions): void;
//# sourceMappingURL=generate-tests.d.ts.map