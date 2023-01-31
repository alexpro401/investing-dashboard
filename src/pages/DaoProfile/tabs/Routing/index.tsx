import React, { useEffect, useContext, useMemo, useCallback } from "react"
import {
  useParams,
  Routes,
  Route,
  useNavigate,
  useLocation,
  generatePath,
  Navigate,
} from "react-router-dom"
import { useWeb3React } from "@web3-react/core"

import { useBreakpoints } from "hooks"
import Tabs from "common/Tabs"
import { ROUTE_PATHS } from "consts"
import { Flex } from "theme"
import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"
import {
  EDaoProfileTab,
  mapProfileTabToRoute,
  mapProfileTabToTitle,
} from "types/govPoolProfile.types"
import TabFallback from "../TabFallback"

const DaoProfileTabAbout = React.lazy(() => import("../DaoProfileTabAbout"))
const DaoProfileTabBalance = React.lazy(() => import("../DaoProfileTabBalance"))
const DaoProfileTabValidators = React.lazy(
  () => import("../DaoProfileTabValidators")
)
const DaoProfileTabDelegations = React.lazy(
  () => import("../DaoProfileTabDelegations")
)

import * as S from "../../styled"

interface IRoutingProps {
  creationTime: number | undefined
}

const Routing: React.FC<IRoutingProps> = ({ creationTime }) => {
  const { isMobile } = useBreakpoints()
  const { currentTab } = useContext(GovPoolProfileTabsContext)
  const { daoAddress } = useParams()
  const { chainId } = useWeb3React()
  const navigate = useNavigate()
  const location = useLocation()

  const TABS_CONTENT = {
    [EDaoProfileTab.about]: (
      <React.Suspense fallback={<TabFallback />}>
        <DaoProfileTabAbout
          creationTime={creationTime ? Number(creationTime) : undefined}
        />
      </React.Suspense>
    ),
    [EDaoProfileTab.my_balance]: (
      <React.Suspense fallback={<TabFallback />}>
        <DaoProfileTabBalance daoAddress={daoAddress} />
      </React.Suspense>
    ),
    [EDaoProfileTab.validators]: (
      <React.Suspense fallback={<TabFallback />}>
        <DaoProfileTabValidators chainId={chainId} />
      </React.Suspense>
    ),
    [EDaoProfileTab.delegations]: (
      <React.Suspense fallback={<TabFallback />}>
        <DaoProfileTabDelegations chainId={chainId} daoAddress={daoAddress} />
      </React.Suspense>
    ),
  }

  const handleDesktopInitialTab = useCallback(() => {
    const locationSplitted = location.pathname.split("/")
    const locationTab = locationSplitted[3]

    for (const tab in EDaoProfileTab) {
      if (mapProfileTabToRoute[EDaoProfileTab[tab]] === locationTab) {
        console.log("selectedTab: ", tab)

        currentTab.set(EDaoProfileTab[tab])
        break
      }
    }
  }, [location, currentTab])

  useEffect(() => {
    if (isMobile) {
      navigate(
        generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": "",
        })
      )
    }
  }, [isMobile, daoAddress, navigate])

  useEffect(() => {
    if (!isMobile) {
      handleDesktopInitialTab()
    }
  }, [isMobile, handleDesktopInitialTab])

  const TABS = useMemo(
    () => [
      {
        name: mapProfileTabToTitle[EDaoProfileTab.about],
        child: TABS_CONTENT[EDaoProfileTab.about],
        onClick: () => currentTab.set(EDaoProfileTab.about),
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.about],
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.my_balance],
        child: TABS_CONTENT[EDaoProfileTab.my_balance],
        onClick: () => currentTab.set(EDaoProfileTab.my_balance),
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.my_balance],
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.validators],
        child: TABS_CONTENT[EDaoProfileTab.validators],
        onClick: () => currentTab.set(EDaoProfileTab.validators),
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.validators],
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.delegations],
        child: TABS_CONTENT[EDaoProfileTab.delegations],
        onClick: () => currentTab.set(EDaoProfileTab.delegations),
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.delegations],
      },
    ],
    [TABS_CONTENT, currentTab]
  )

  if (isMobile)
    return (
      <Flex full m="40px 0 16px">
        <S.Indents>
          <Tabs
            tabs={TABS}
            initialTab={0}
            onChangeTab={({ name }) => currentTab.set(name as EDaoProfileTab)}
          />
        </S.Indents>
      </Flex>
    )

  return (
    <Routes>
      {TABS.map((tab, index) => (
        <Route key={index} element={tab.child} path={tab.internalRoute} />
      ))}
      <Route
        path="*"
        element={
          <Navigate
            to={generatePath(ROUTE_PATHS.daoProfile, {
              daoAddress: daoAddress ?? "",
              "*": mapProfileTabToRoute[EDaoProfileTab.about],
            })}
          />
        }
      />
    </Routes>
  )
}

export default Routing
