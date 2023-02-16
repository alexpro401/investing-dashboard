import React, { useContext, useMemo } from "react"
import { useParams, generatePath } from "react-router-dom"

import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"
import { ROUTE_PATHS } from "consts"
import {
  EDaoProfileTab,
  mapProfileTabToRoute,
  mapProfileTabToTitle,
} from "types/govPoolProfile.types"
import RouteTabs from "components/RouteTabs"

const DesktopRouteTabs: React.FC = () => {
  const { currentTab } = useContext(GovPoolProfileTabsContext)
  const { daoAddress } = useParams()

  const DESKTOP_ROUTE_TABS = useMemo(
    () => [
      {
        title: mapProfileTabToTitle[EDaoProfileTab.about],
        source: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.about],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.about),
      },
      {
        title: mapProfileTabToTitle[EDaoProfileTab.my_balance],
        source: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.my_balance],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.my_balance),
      },
      {
        title: mapProfileTabToTitle[EDaoProfileTab.dao_proposals],
        source: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.dao_proposals],
        }),
        activeSource: [
          generatePath(ROUTE_PATHS.daoProfile, {
            daoAddress: daoAddress ?? "",
            "*": generatePath(
              mapProfileTabToRoute[EDaoProfileTab.dao_proposals],
              {
                "*": "",
              }
            ),
          }),
        ],
        onClick: () => currentTab.set(EDaoProfileTab.dao_proposals),
      },
      {
        title: mapProfileTabToTitle[EDaoProfileTab.validators],
        source: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.validators],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.validators),
      },
      {
        title: mapProfileTabToTitle[EDaoProfileTab.delegations],
        source: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.delegations],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.delegations),
      },
    ],
    [currentTab, daoAddress]
  )

  return <RouteTabs tabs={DESKTOP_ROUTE_TABS} full={false} themeType={"blue"} />
}

export default DesktopRouteTabs
