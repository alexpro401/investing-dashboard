import { useCallback, useEffect, useState } from "react"
import copy from "copy-to-clipboard"

export function useCopyClipboard(
  timeout = 500
): [boolean, (toCopy: string) => void] {
  const [isCopied, setIsCopied] = useState(false)

  const staticCopy = useCallback((text) => {
    const didCopy = copy(text)
    setIsCopied(didCopy)
  }, [])

  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false)
      }, timeout)
      return () => {
        clearTimeout(hide)
      }
    }
    return undefined
  }, [isCopied, timeout])

  return [isCopied, staticCopy]
}

export default useCopyClipboard
