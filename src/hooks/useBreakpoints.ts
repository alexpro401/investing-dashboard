import { useWindowSize } from "react-use"
import { useMemo } from "react"
import { breakpoints } from "theme"

export const useBreakpoints = () => {
  const { width: windowWidth } = useWindowSize()

  const isMobile = useMemo(() => windowWidth < breakpoints.sm, [windowWidth])

  return {
    isMobile,
  }
}
