export declare const testSuiteCommit = "e819f329268130e0ed5bbc87b071c83d8e02a68a";
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