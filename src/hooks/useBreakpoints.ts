import { useWindowSize } from "react-use"
import { useMemo } from "react"
import { breakpoints } from "theme"

export const useBreakpoints = () => {
  const { width: windowWidth } = useWindowSize()

  const isMobile = useMemo(
    () => windowWidth < breakpoints.sm - 1,
    [windowWidth]
  )
  const isTablet = useMemo(
    () => windowWidth < breakpoints.md - 1,
    [windowWidth]
  )
  const isDesktop = useMemo(
    () => windowWidth >= breakpoints.lg - 1,
    [windowWidth]
  )

  return {
    isMobile,
    isTablet,
    isDesktop,
  }
}
