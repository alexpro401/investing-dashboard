import { FC, HTMLAttributes, useEffect } from "react"

import * as S from "./styled"
import { useSelector } from "react-redux"
import { selectIsTabBarHidden } from "state/application/selectors"
import { useBreakpoints, useForceUpdate } from "hooks"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const AppNavigation: FC<Props> = ({ ...rest }) => {
  const isTabBarHidden = useSelector(selectIsTabBarHidden)

  const { isMobile } = useBreakpoints()

  const [, update] = useForceUpdate()

  useEffect(() => {
    update()
  }, [isTabBarHidden, update])

  return (
    <S.Root {...rest}>
      {isMobile ? (
        isTabBarHidden ? (
          <div id="app-navigation" />
        ) : (
          <S.NavTapBar />
        )
      ) : (
        <S.NavTapBar />
      )}
    </S.Root>
  )
}

export default AppNavigation
