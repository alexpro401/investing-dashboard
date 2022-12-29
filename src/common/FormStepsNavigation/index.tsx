import { FC, HTMLAttributes, ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"
import { useSelector } from "react-redux"

import { useBreakpoints, useForceUpdate } from "hooks"
import { StepsNavigation } from "../index"
import { selectIsTabBarHidden } from "state/application/selectors"

interface Props extends HTMLAttributes<HTMLDivElement> {
  nodeLeft?: ReactNode
  nodeRight?: ReactNode

  customPrevCb?: () => void
  customNextCb?: () => void

  prevLabel?: string
  nextLabel?: string
}

const FormStepsNavigation: FC<Props> = ({ customNextCb, ...rest }) => {
  const isTabBarHidden = useSelector(selectIsTabBarHidden)

  const appNavigationEl = document.querySelector("#app-navigation")

  const { isMobile } = useBreakpoints()
  const [, update] = useForceUpdate()

  const NavigationComponent = (
    <StepsNavigation customNextCb={customNextCb} {...rest} />
  )

  useEffect(() => {
    update()
  }, [appNavigationEl, isTabBarHidden])

  return isMobile ? (
    appNavigationEl ? (
      createPortal(NavigationComponent, appNavigationEl)
    ) : (
      <></>
    )
  ) : (
    NavigationComponent
  )
}

export default FormStepsNavigation
