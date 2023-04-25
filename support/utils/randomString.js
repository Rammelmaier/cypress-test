import { Chance } from 'chance';

const newChance = new Chance();

export function randomNumericString(outputLength) {
  return newChance.string({ length: outputLength, numeric: true, alpha: false, symbols: false });
}

export function randomAlphabeticString(outputLength) {
  return newChance.string({ length: outputLength, numeric: false, alpha: true, symbols: false });
}

export function randomSymbolicString(outputLength) {
  return newChance.string({ length: outputLength, numeric: false, alpha: false, symbols: true });
}

export function randomString(outputLength) {
  return newChance.string({ length: outputLength, numeric: true, alpha: true, symbols: true });
}

export function randomEmoji(outputLength) {
  const sample = '♈';
  return sample.repeat(outputLength);
}
