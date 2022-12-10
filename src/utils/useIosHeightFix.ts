import { useEffect } from "react"

const setCssCustomHeightProperty = () => {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty(`--vh`, `${vh}px`)
}

const useIosHeightFix = () => {
  useEffect(() => {
    setCssCustomHeightProperty()

    const orientationChangeHandler = () => {
      setCssCustomHeightProperty()

      document.documentElement.style.height = `initial`
      setTimeout(() => {
        document.documentElement.style.height = `100%`
        setTimeout(() => {
          // this line prevents the content
          // from hiding behind the address bar

          typeof window !== `undefined` && window.scrollTo(0, 1)
        }, 0)
      }, 0)
    }

    typeof window !== `undefined` &&
      window.addEventListener(`resize`, setCssCustomHeightProperty, false)
    typeof window !== `undefined` &&
      window.addEventListener(
        `orientationchange`,
        orientationChangeHandler,
        false
      )

    return () => {
      typeof window !== `undefined` &&
        window.removeEventListener(`resize`, setCssCustomHeightProperty, false)
      typeof window !== `undefined` &&
        window.removeEventListener(
          `orientationchange`,
          orientationChangeHandler,
          false
        )
    }
  }, [])
}

export default useIosHeightFix
