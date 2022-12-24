import { FC, HTMLAttributes, ReactNode, useEffect } from "react"
import { useBreakpoints, useForceUpdate } from "hooks"
import { StepsNavigation } from "../index"
import { createPortal } from "react-dom"

interface Props extends HTMLAttributes<HTMLDivElement> {
  nodeLeft?: ReactNode
  nodeRight?: ReactNode

  customPrevCb?: () => void
  customNextCb?: () => void

  prevLabel?: string
  nextLabel?: string
}

const FormStepsNavigation: FC<Props> = ({ customNextCb, ...rest }) => {
  const appNavigationEl = document.querySelector("#app-navigation")

  const { isMobile } = useBreakpoints()
  const [, update] = useForceUpdate()

  const NavigationComponent = (
    <StepsNavigation customNextCb={customNextCb} {...rest} />
  )

  useEffect(() => {
    update()
  }, [appNavigationEl])

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
