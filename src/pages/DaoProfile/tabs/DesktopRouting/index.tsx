import React, { useContext, useMemo } from "react"
import {
  useParams,
  Routes,
  Route,
  generatePath,
  Navigate,
} from "react-router-dom"
import { useWeb3React } from "@web3-react/core"

import { ROUTE_PATHS } from "consts"
import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import {
  EDaoProfileTab,
  mapProfileTabToRoute,
  mapProfileTabToTitle,
} from "types/govPoolProfile.types"
import TabFallback from "../TabFallback"

const DaoProfileTabAboutMobile = React.lazy(
  () => import("../mobile/DaoProfileTabAbout")
)
const DaoProfileTabBalanceMobile = React.lazy(
  () => import("../mobile/DaoProfileTabBalance")
)
const DaoProfileTabValidatorsMobile = React.lazy(
  () => import("../mobile/DaoProfileTabValidators")
)
const DaoProfileTabDelegationsMobile = React.lazy(
  () => import("../mobile/DaoProfileTabDelegations")
)

const DesktopRouting: React.FC = () => {
  const { govPoolQuery } = useContext(GovPoolProfileCommonContext)
  const { daoAddress } = useParams()
  const { chainId } = useWeb3React()

  const creationTime = useMemo(
    () =>
      govPoolQuery?.data?.daoPool?.creationTime
        ? Number(govPoolQuery.data.daoPool.creationTime)
        : undefined,
    [govPoolQuery]
  )

  const TABS_DESKTOP_CONTENT = {
    [EDaoProfileTab.about]: (
      <React.Suspense fallback={<TabFallback />}>
        <DaoProfileTabAboutMobile
          creationTime={creationTime ? Number(creationTime) : undefined}
        />
      </React.Suspense>
    ),
    [EDaoProfileTab.my_balance]: (
      <React.Suspense fallback={<TabFallback />}>
        <DaoProfileTabBalanceMobile daoAddress={daoAddress} />
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
