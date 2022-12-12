import { FC, ReactNode, useEffect, useState } from "react"

import HeaderTabs from "components/Header/Tabs"
import { More, GoBack } from "./Components"

import { Container, Bar, Icons, Title } from "./styled"
import { ITab } from "interfaces"
import { createPortal } from "react-dom"

interface Props {
  left?: ReactNode
  right?: ReactNode
  tabs?: ITab[]
  children?: ReactNode
}

const Layout: FC<Props> = ({ children, left, right, tabs }) => {
  const AppHeaderNode = document.querySelector("#app-header")

  const [, updateComponent] = useState(false)

  useEffect(() => {
    updateComponent(true)
  }, [AppHeaderNode])

  return (
    AppHeaderNode &&
    createPortal(
      <Container
        key={Number(!!AppHeaderNode)}
        initial={{ y: -102 }}
        animate={{ y: 0 }}
        exit={{ y: -102 }}
        transition={{ duration: 0.4, ease: [0.29, 0.98, 0.29, 1] }}
      >
        <Bar>
          <Icons>{left || <GoBack />}</Icons>
          <Title>{children}</Title>
          <Icons>
            {right}
            <More />
          </Icons>
        </Bar>
        {tabs !== undefined && !!tabs.length && <HeaderTabs tabs={tabs} />}
      </Container>,
      AppHeaderNode
    )
  )
}

export default Layout
