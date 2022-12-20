import { useLocation } from "react-router-dom"

// custom hook to get the current pathname in React

export function usePathname(): string {
  const location = useLocation()
  return location.pathname
}

export default usePathname
