export function roundEthValue (value: number): number {
  const million = 1000 * 1000
  return Math.round(value * million) / million
}
