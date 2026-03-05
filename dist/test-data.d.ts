export declare const packageVersion = "0.2.1";
export declare const testSuiteCommit = "583d7c62c9f5fc382530d59e0fa01481a6d10470";
export interface TestCase {
    description: string;
    data: unknown;
    valid: boolean;
    [key: string]: unknown;
}
export interface TestGroup {
    description: string;
    schema: unknown;
    tests: TestCase[];
    [key: string]: unknown;
}
export declare const testData: Record<string, Record<string, TestGroup[]>>;
//# sourceMappingURL=test-data.d.ts.map