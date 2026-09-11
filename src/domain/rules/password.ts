export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRuleId = 'length' | 'uppercase' | 'alphanumeric';

export type PasswordCheck = { id: PasswordRuleId; met: boolean };

/**
 * House password policy: at least 8 alphanumeric characters, at least one of them upper case.
 *
 * "Alphanumeric" is enforced literally — anything outside A-Z, a-z and 0-9 fails, including
 * spaces and accented letters. Keep this list in sync with the Supabase dashboard policy
 * (Authentication > Policies), which is the half a client cannot bypass.
 */
export function checkPassword(password: string): PasswordCheck[] {
  return [
    { id: 'length', met: password.length >= PASSWORD_MIN_LENGTH },
    { id: 'uppercase', met: /[A-Z]/.test(password) },
    { id: 'alphanumeric', met: password.length > 0 && /^[A-Za-z0-9]+$/.test(password) },
  ];
}

export function isValidPassword(password: string): boolean {
  return checkPassword(password).every((check) => check.met);
}

/** The rule to complain about first — one message beats three. */
export function firstPasswordFailure(password: string): PasswordRuleId | null {
  return checkPassword(password).find((check) => !check.met)?.id ?? null;
}
