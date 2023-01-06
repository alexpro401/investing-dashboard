import { useWindowSize } from "react-use"
import { useMemo } from "react"
import { breakpoints } from "theme"

export const useBreakpoints = () => {
  const { width: windowWidth } = useWindowSize()

  const isMobile = useMemo(
    () => windowWidth < breakpoints.sm - 1,
    [windowWidth]
  )
  const isMediumTablet = useMemo(
    () => windowWidth > breakpoints.xmd - 1,
    [windowWidth]
  )
  // TODO: should be windowWidth > breakpoints.md - 1
  const isTablet = useMemo(
    () => windowWidth > breakpoints.sm - 1,
    [windowWidth]
  )
  const isDesktop = useMemo(
    () => windowWidth >= breakpoints.lg - 1,
    [windowWidth]
  )

  return {
    isMobile,
    isMediumTablet,
    isTablet,
    isDesktop,
  }
}
