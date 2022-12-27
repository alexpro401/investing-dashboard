import { FC, HTMLAttributes, useMemo } from "react"
import { useMatches } from "react-router-dom"
import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const Breadcrumbs: FC<Props> = () => {
  const matches = useMatches()

  const currentMatch = useMemo(() => matches[matches.length - 1], [matches])

  const crumbs = useMemo<{ label: string; path: string }[]>(
    () =>
      !!currentMatch.handle
        ? (
            currentMatch.handle as (params) => { label: string; path: string }[]
          )(currentMatch.params)
        : [],
    [currentMatch.handle, currentMatch.params]
  )

  console.log(matches, crumbs)

  return (
    <S.Root>
      {crumbs.length ? (
        crumbs.map((el, idx) => (
          <S.BreadcrumbItem key={idx} to={el.path}>
            {`${el.label} ${idx !== crumbs.length - 1 ? "/ " : ""}`}
          </S.BreadcrumbItem>
        ))
      ) : (
        <></>
      )}
    </S.Root>
  )
}

export default Breadcrumbs
