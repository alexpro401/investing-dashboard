// https://stackoverflow.com/a/33034768/8323878

export const arrayDifference = <T>(a1: T[], a2: T[]): T[] =>
  a1.filter((x) => !a2.includes(x))

export const arrayIntersection = <T>(a1: T[], a2: T[]): T[] =>
  a1.filter((x) => a2.includes(x))

export const arrayIncludes = <T>(a: T[], value: T): boolean => a.includes(value)

export const arraysEqual = (a, b) => {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  a.sort()
  b.sort()

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}
