import { FC, HTMLAttributes, useEffect, useMemo } from "react"

import * as S from "./styled"
import { useWindowSize } from "react-use"
import useForceUpdate from "hooks/useForceUpdate"
import { useSelector } from "react-redux"
import { selectIsTabBarHidden } from "state/application/selectors"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const AppNavigation: FC<Props> = ({ ...rest }) => {
  const { width: windowWidth } = useWindowSize()

  const isTabBarHidden = useSelector(selectIsTabBarHidden)

  const isMobile = useMemo(() => windowWidth < 768, [windowWidth])

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
