import {
  PASSWORD_MIN_LENGTH,
  checkPassword,
  firstPasswordFailure,
  isValidPassword,
} from '../password';

describe('password policy', () => {
  it('accepts eight alphanumeric characters with an upper case', () => {
    expect(isValidPassword('Naranja1')).toBe(true);
  });

  it('accepts letters only, as long as one is upper case', () => {
    expect(isValidPassword('Higuera')).toBe(false); // seven characters
    expect(isValidPassword('Higueras')).toBe(true);
  });

  it('rejects anything shorter than the minimum', () => {
    expect('Fruta1'.length).toBeLessThan(PASSWORD_MIN_LENGTH);
    expect(isValidPassword('Fruta1')).toBe(false);
    expect(firstPasswordFailure('Fruta1')).toBe('length');
  });

  it('rejects an all-lower-case password', () => {
    expect(isValidPassword('naranjas1')).toBe(false);
    expect(firstPasswordFailure('naranjas1')).toBe('uppercase');
  });

  it('rejects non-alphanumeric characters, spaces and accents included', () => {
    expect(isValidPassword('Naranja!1')).toBe(false);
    expect(isValidPassword('Naranja 1')).toBe(false);
    expect(isValidPassword('Nísperos1')).toBe(false);
    expect(firstPasswordFailure('Naranja!1')).toBe('alphanumeric');
  });

  it('reports every rule as unmet for an empty password', () => {
    expect(checkPassword('').every((check) => !check.met)).toBe(true);
  });

  it('reports length before case when both fail', () => {
    expect(firstPasswordFailure('abc')).toBe('length');
  });
});
