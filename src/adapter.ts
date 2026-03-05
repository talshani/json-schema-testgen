export type ValidateResult = { valid: boolean; errors?: string[] };

export type ValidateOptions = { formatAssertion?: boolean };

export type ValidateFn = (schema: unknown, data: unknown, draft: string, options: ValidateOptions) => ValidateResult;
