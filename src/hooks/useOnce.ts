import { useCallback } from "react"

/*
    The useOnce hook is a utility hook
    that allows you to call a callback function just once.
    It returns a wrapped version of the callback function
    that checks whether the callback has been called before,
    using sessionStorage to store the state.
    If the callback has not been called before,
    the useOnce hook will call the callback and save the fact that
    it has been called in sessionStorage.
    If the callback has already been called,
    the useOnce hook will do nothing.
*/

export function useOnce(callback: () => void, name: string) {
  const wrappedCallback = useCallback(() => {
    const isCalled = sessionStorage.getItem(name)

    if (isCalled !== "true") {
      callback()
      sessionStorage.setItem(name, "true")
    }
  }, [callback, name])

  return wrappedCallback
}
