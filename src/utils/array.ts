export const arrayDifference = <T>(a1: T[], a2: T[]): T[] =>
  a1.filter((x) => !a2.includes(x))

export const arrayIntersection = <T>(a1: T[], a2: T[]): T[] =>
  a1.filter((x) => a2.includes(x))

export const arrayIncludes = <T>(a: T[], value: T): boolean => a.includes(value)

export const replaceAt = <A>(
  array: A[],
  index: number,
  replacement: A
): A[] => {
  return array
    .slice(0, index)
    .concat([replacement])
    .concat(array.slice(index + 1))
}
