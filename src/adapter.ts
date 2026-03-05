export type ValidateResult = { valid: boolean; errors?: string[] };

export type ValidateFn = (schema: unknown, data: unknown, draft: string) => ValidateResult;