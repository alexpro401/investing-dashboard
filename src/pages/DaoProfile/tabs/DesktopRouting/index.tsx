import React, { useMemo } from "react"
import {
  useParams,
  Routes,
  Route,
  generatePath,
  Navigate,
} from "react-router-dom"
import { useWeb3React } from "@web3-react/core"

import { ROUTE_PATHS } from "consts"
import {
  EDaoProfileTab,
  mapProfileTabToRoute,
  mapProfileTabToTitle,
} from "types/govPoolProfile.types"
import TabFallback from "../TabFallback"

const DaoProfileTabAboutDesktop = React.lazy(
  () => import("../desktop/AboutTab")
)
const DaoProfileTabMyBalanceDesktop = React.lazy(
  () => import("../desktop/MyBalance")
)
const DaoProfileTabValidatorsMobile = React.lazy(
  () => import("../mobile/DaoProfileTabValidators")
)
const DaoProfileTabDelegationsMobile = React.lazy(
  () => import("../mobile/DaoProfileTabDelegations")
)

const DesktopRouting: React.FC = () => {
  const { daoAddress } = useParams()
  const { chainId } = useWeb3React()

  const TABS_DESKTOP_CONTENT = {
    [EDaoProfileTab.about]: (
      <React.Suspense fallback={<TabFallback />}>
        <DaoProfileTabAboutDesktop />
      </React.Suspense>
    ),
    [EDaoProfileTab.my_balance]: (
      <React.Suspense fallback={<TabFallback />}>
        <DaoProfileTabMyBalanceDesktop />
      </React.Suspense>
    ),
    [EDaoProfileTab.validators]: (
      <React.Suspense fallback={<TabFallback />}>
        <DaoProfileTabValidatorsMobile chainId={chainId} />
      </React.Suspense>
    ),
    [EDaoProfileTab.delegations]: (
      <React.Suspense fallback={<TabFallback />}>
        <DaoProfileTabDelegationsMobile
          chainId={chainId}
          daoAddress={daoAddress}
        />
      </React.Suspense>
    ),
  }

  const TABS = useMemo(
    () => [
      {
        name: mapProfileTabToTitle[EDaoProfileTab.about],
        child: TABS_DESKTOP_CONTENT[EDaoProfileTab.about],
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.about],
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.my_balance],
        child: TABS_DESKTOP_CONTENT[EDaoProfileTab.my_balance],
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.my_balance],
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.validators],
        child: TABS_DESKTOP_CONTENT[EDaoProfileTab.validators],
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.validators],
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.delegations],
        child: TABS_DESKTOP_CONTENT[EDaoProfileTab.delegations],
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.delegations],
      },
    ],
    [TABS_DESKTOP_CONTENT]
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

export default DesktopRouting