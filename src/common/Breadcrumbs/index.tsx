import { FC, HTMLAttributes, useMemo } from "react"
import { NavLink, useMatches } from "react-router-dom"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Breadcrumbs: FC<Props> = () => {
  const matches = useMatches()

  const crumbs = useMemo(() => {
    return matches
      .filter((el) => !!el.handle)
      .map((el) => ({
        title: (el.handle as (params) => { title: string })(el.params)?.title,
        path: el.pathname,
      }))
  }, [matches])

  console.log(matches, crumbs)

  return (
    <>
      {crumbs.map((el, idx) => (
        <NavLink key={idx} to={el.path}>
          {el.title}
        </NavLink>
      ))}
    </>
  )
}

export default Breadcrumbs
