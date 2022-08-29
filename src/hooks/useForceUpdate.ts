import { useCallback, useRef, useState } from "react"

const useForceUpdate = (): [boolean, () => void] => {
  const [, setUpdate] = useState(false)
  const updateRef = useRef(false)

  const update = useCallback(() => {
    updateRef.current = !updateRef.current
    setUpdate(updateRef.current)
  }, [])

  return [updateRef.current, update]
}

export default useForceUpdate
