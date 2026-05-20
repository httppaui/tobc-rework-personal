export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { id: 'letter', label: 'Contains a letter', test: (p: string) => /[a-zA-Z]/.test(p) },
  { id: 'number', label: 'Contains a number', test: (p: string) => /\d/.test(p) },
] as const;

export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export function passwordValidationError(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[a-zA-Z]/.test(password)) return 'Password must contain a letter.';
  if (!/\d/.test(password)) return 'Password must contain a number.';
  return null;
}
