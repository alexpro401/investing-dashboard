import React, {
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react"
import {
  useParams,
  Routes,
  Route,
  Link,
  generatePath,
  useNavigate,
  Navigate,
} from "react-router-dom"
import { useWeb3React } from "@web3-react/core"

import * as S from "./styled"
import {
  DaoProfileStatisticCard,
  DaoProfileChart,
  DaoProfileTokensInTreasuryCard,
  DesktopRouteTabs,
} from "./components"
import { ROUTE_PATHS } from "consts"
import { TabFallback } from "./tabs"
import { PageChart } from "./types"
import {
  EDaoProfileTab,
  mapProfileTabToRoute,
  mapProfileTabToTitle,
} from "types/govPoolProfile.types"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import ChooseDaoProposalAsPerson from "modals/ChooseDaoProposalAsPerson"
import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"
import Tabs from "common/Tabs"
import { Flex } from "theme"

import { useQuery } from "urql"
import { GovPoolQuery } from "queries"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import { useBreakpoints } from "hooks"
import { Breadcrumbs } from "common"
import { graphClientDaoPools } from "utils/graphClient"

const DaoProfileTabAbout = React.lazy(() => import("./tabs/DaoProfileTabAbout"))
const DaoProfileTabBalance = React.lazy(
  () => import("./tabs/DaoProfileTabBalance")
)
const DaoProfileTabValidators = React.lazy(
  () => import("./tabs/DaoProfileTabValidators")
)
const DaoProfileTabDelegations = React.lazy(
  () => import("./tabs/DaoProfileTabDelegations")
)

const DaoProfile: React.FC = () => {
  const { account, chainId } = useWeb3React()
  const { daoAddress } = useParams()
  const navigate = useNavigate()

  const { currentTab, daoDescription } = useContext(GovPoolProfileTabsContext)

  const [govPoolQuery] = useQuery<{ daoPool: IGovPoolQuery }>({
    query: GovPoolQuery,
    variables: useMemo(() => ({ address: daoAddress }), [daoAddress]),
    context: graphClientDaoPools,
  })

  const isValidator = true

  const [chart, setChart] = useState<PageChart>(PageChart.tvl)

  const [createProposalModalOpened, setCreateProposalModalOpened] =
    useState<boolean>(false)

  const handleOpenCreateProposalModal = useCallback(() => {
    setCreateProposalModalOpened(true)
  }, [])

  const handleCloseCreateProposalModal = useCallback(() => {
    setCreateProposalModalOpened(false)
  }, [])

  const TABS_CONTENT = {
    [EDaoProfileTab.about]: (
      <React.Suspense fallback={<TabFallback />}>
        <DaoProfileTabAbout
          creationTime={
            govPoolQuery.data?.daoPool?.creationTime
              ? Number(govPoolQuery.data.daoPool.creationTime)
              : undefined
          }
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

  const TABS = useMemo(
    () => [
      {
        name: mapProfileTabToTitle[EDaoProfileTab.about],
        child: TABS_CONTENT[EDaoProfileTab.about],
        route: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.about],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.about),
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.about],
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.my_balance],
        child: TABS_CONTENT[EDaoProfileTab.my_balance],
        route: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.my_balance],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.my_balance),
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.my_balance],
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.validators],
        child: TABS_CONTENT[EDaoProfileTab.validators],
        route: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.validators],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.validators),
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.validators],
      },
      {
        name: mapProfileTabToTitle[EDaoProfileTab.delegations],
        child: TABS_CONTENT[EDaoProfileTab.delegations],
        route: generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": mapProfileTabToRoute[EDaoProfileTab.delegations],
        }),
        onClick: () => currentTab.set(EDaoProfileTab.delegations),
        internalRoute: mapProfileTabToRoute[EDaoProfileTab.delegations],
      },
    ],
    [TABS_CONTENT, currentTab, daoAddress]
  )

  const DaoProfilePageTabs = useMemo(() => {
    return (
      <S.Indents>
        <Tabs
          tabs={TABS}
          initialTab={0}
          onChangeTab={({ name }) => currentTab.set(name as EDaoProfileTab)}
        />
      </S.Indents>
    )
  }, [currentTab, TABS])

  const { isMobile, isDesktop } = useBreakpoints()

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
      //TODO handle redirect to some step when we come to pages first time
    }
  }, [isMobile])

  return (
    <>
      <Header>{isMobile ? "Dao Profile" : <Breadcrumbs />}</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.Container>
          {!isMobile && (
            <DesktopRouteTabs
              tabs={TABS.map((tab) => ({
                source: tab.route,
                title: tab.name,
                onClick: tab.onClick,
              }))}
            />
          )}
          <S.Indents top>
            <DaoProfileStatisticCard
              isValidator={isValidator}
              handleOpenCreateProposalModal={handleOpenCreateProposalModal}
              account={account}
              govPoolQuery={{
                ...((govPoolQuery.data?.daoPool
                  ? {
                      ...govPoolQuery.data?.daoPool,
                      name: daoDescription
                        ? daoDescription.daoName
                        : govPoolQuery.data.daoPool.name,
                    }
                  : {}) as IGovPoolQuery),
              }}
            />
            <S.Indents top side={false}>
              <DaoProfileChart chart={chart} setChart={setChart} />
            </S.Indents>
            {/* TODO */}
            {/* <S.Indents top side={false}>
              <DaoProfileBuyTokenCard
                total={BigNumber.from(100)}
                available={BigNumber.from(34)}
              />
            </S.Indents> */}
            <S.Indents top side={false}>
              <DaoProfileTokensInTreasuryCard />
            </S.Indents>
          </S.Indents>
          {isMobile && (
            <>
              <Flex full m="40px 0 16px">
                {DaoProfilePageTabs}
              </Flex>
            </>
          )}
          {!isMobile && (
            <Routes>
              {TABS.map((tab, index) => (
                <Route
                  key={index}
                  element={tab.child}
                  path={tab.internalRoute}
                />
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
          )}
        </S.Container>
      </WithGovPoolAddressValidation>
      <ChooseDaoProposalAsPerson
        isOpen={createProposalModalOpened}
        daoAddress={daoAddress ?? ""}
        toggle={handleCloseCreateProposalModal}
      />
    </>
  )
}

export default DaoProfile
