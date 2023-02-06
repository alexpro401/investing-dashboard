import React, { useContext, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"

import Tabs from "common/Tabs"
import { Flex } from "theme"
import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"
import {
  EDaoProfileTab,
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

import * as S from "../../styled"

const MobileRouting: React.FC = () => {
  const { currentTab } = useContext(GovPoolProfileTabsContext)
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

  const TABS_MOBILE_CONTENT = {
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
        child: TABS_MOBILE_CONTENT[EDaoProfileTab.about],
        onClick: () => currentTab.set(EDaoProfileTab.about),
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.my_balance],
        child: TABS_MOBILE_CONTENT[EDaoProfileTab.my_balance],
        onClick: () => currentTab.set(EDaoProfileTab.my_balance),
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.validators],
        child: TABS_MOBILE_CONTENT[EDaoProfileTab.validators],
        onClick: () => currentTab.set(EDaoProfileTab.validators),
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.delegations],
        child: TABS_MOBILE_CONTENT[EDaoProfileTab.delegations],
        onClick: () => currentTab.set(EDaoProfileTab.delegations),
      },
    ],
    [TABS_MOBILE_CONTENT, currentTab]
  )

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
}

export default MobileRouting
