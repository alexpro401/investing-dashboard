import React, { useContext, useMemo } from "react"
import { useLocation, useParams, generatePath } from "react-router-dom"

import isActiveRoute from "utils/isActiveRoute"
import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"
import { ROUTE_PATHS } from "consts"
import {
  EDaoProfileTab,
  mapProfileTabToRoute,
  mapProfileTabToTitle,
} from "types/govPoolProfile.types"

import S from "./styled"

const DesktopRouteTabs: React.FC = () => {
  const { pathname } = useLocation()
  const { currentTab } = useContext(GovPoolProfileTabsContext)
  const { daoAddress } = useParams()

  const DESKTOP_ROUTE_TABS = useMemo(
    () => [
      {
        name: mapProfileTabToTitle[EDaoProfileTab.about],
        route: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.about],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.about),
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.my_balance],
        route: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.my_balance],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.my_balance),
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.validators],
        route: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.validators],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.validators),
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.delegations],
        route: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.delegations],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.delegations),
      },
    ],
    [currentTab, daoAddress]
  )

  return (
    <S.Tabs
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {DESKTOP_ROUTE_TABS.map((tab, tabIndex) => (
        <S.Tab
          key={tabIndex}
          to={tab.route}
          active={isActiveRoute(pathname, tab.route)}
          onClick={tab.onClick}
        >
          {tab.name}
        </S.Tab>
      ))}
    </S.Tabs>
  )
}

export default DesktopRouteTabs
