import { FC, ReactNode, useEffect, useState } from "react"
import { Icon, Wallet } from "common"

import HeaderTabs from "components/Header/Tabs"
import { More, GoBack } from "./Components"

import * as S from "./styled"
import { ITab } from "interfaces"
import { createPortal } from "react-dom"
import { ICON_NAMES } from "consts"

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
      <S.Container
        key={Number(!!AppHeaderNode)}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        exit={{ y: -20 }}
        transition={{ duration: 0.2, ease: [0.29, 0.98, 0.29, 1] }}
      >
        <S.Bar>
          <S.MobileLogo />
          <S.Title>{children}</S.Title>
          <Wallet />
        </S.Bar>
        {tabs && !!tabs.length && <HeaderTabs tabs={tabs} />}
      </S.Container>,
      AppHeaderNode
    )
  )
}

export default Layout
