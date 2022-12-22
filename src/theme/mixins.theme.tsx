import { breakpoints } from "theme"

export const respondTo = (breakpoint: keyof typeof breakpoints) => {
  const minWidth = breakpoints[breakpoint]

  return `@media (min-width: ${minWidth - 1}px)`
}
