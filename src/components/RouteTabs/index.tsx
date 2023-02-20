import { FC, useMemo } from "react"
import { useLocation } from "react-router-dom"

import { ITab } from "interfaces"
import isActiveRoute from "utils/isActiveRoute"

import S from "./styled"

interface IProps {
  m?: string
  tabs: ITab[]
  full?: boolean
  themeType?: "gray" | "blue"
}

const RouteTabs: FC<IProps> = ({
  tabs,
  m = "0",
  full = true,
  themeType = "gray",
  ...rest
}) => {
  const { pathname } = useLocation()

  const isActive = useMemo(
    () => (source, activeSource) => {
      if (activeSource && activeSource.length > 0) {
        return activeSource.some((s) => isActiveRoute(pathname, s))
      }

      return isActiveRoute(pathname, source)
    },
    [pathname]
  )

  return (
    <>
      <S.Tabs
        m={m}
        full={full}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        {...rest}
      >
        {tabs.map((tab, tabIndex) => {
          if (tab.source) {
            return (
              <S.Tab
                key={tabIndex}
                to={tab.source}
                themeType={themeType}
                active={isActive(tab.source, tab.activeSource)}
                onClick={tab.onClick}
              >
                {tab.title}
                {Boolean(tab.amount) && <S.TabAmount>{tab.amount}</S.TabAmount>}
              </S.Tab>
            )
          }

          return (
            <S.Tab
              key={tabIndex}
              as="div"
              themeType={themeType}
              active={tab.isActive}
              onClick={tab.onClick ?? undefined}
            >
              {tab.title}
              {Boolean(tab.amount) && <S.TabAmount>{tab.amount}</S.TabAmount>}
            </S.Tab>
          )
        })}
      </S.Tabs>
    </>
  )
}

export default RouteTabs
