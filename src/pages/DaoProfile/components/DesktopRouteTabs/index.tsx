import { FC } from "react"
import { useLocation } from "react-router-dom"

import { ITab } from "interfaces"
import isActiveRoute from "utils/isActiveRoute"

import S from "./styled"

type ITabExtended = ITab & {
  onClick?: () => void
}

interface IProps {
  m?: string
  tabs: ITabExtended[]
}

const DesktopRouteTabs: FC<IProps> = ({ tabs, m = "0", ...rest }) => {
  const { pathname } = useLocation()

  return (
    <S.Tabs
      m={m}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.2 }}
      {...rest}
    >
      {tabs.map((tab, tabIndex) => (
        <S.Tab
          key={tabIndex}
          to={tab.source}
          active={isActiveRoute(pathname, tab.source)}
          onClick={tab.onClick}
        >
          {tab.title}
          {Boolean(tab.amount) && <S.TabAmount>{tab.amount}</S.TabAmount>}
        </S.Tab>
      ))}
    </S.Tabs>
  )
}

export default DesktopRouteTabs
