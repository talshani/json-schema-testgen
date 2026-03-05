export type ValidateResult = { valid: boolean; errors?: string[] };

export type ValidateFn = (schema: unknown, data: unknown, draft: string) => ValidateResult;

let _validate: ValidateFn | null = null;

export function setValidator(fn: ValidateFn): void {
  _validate = fn;
}

export function validate(schema: unknown, data: unknown, draft: string): ValidateResult {
  if (!_validate) {
    throw new Error("No validator configured. Call setValidator() in a preload script.");
  }
  return _validate(schema, data, draft);
}
