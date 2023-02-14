import {
  Routes,
  Route,
  generatePath,
  Navigate,
  useParams,
} from "react-router-dom"

import Header from "components/Header/Layout"
import {
  PoolPositionsList,
  PoolInvestProposalsList,
  PoolRiskyProposalsList,
  PoolRiskyPositionsList,
} from "common"

import * as S from "./styled"
import { useBreakpoints } from "hooks"
import { ROUTE_PATHS } from "consts"
import { useEffect, useState } from "react"
import { usePoolRegistryContract } from "contracts"

const PoolPositions = () => {
  const { poolAddress } = useParams()
  const { isMobile } = useBreakpoints()

  const traderPoolRegistry = usePoolRegistryContract()
  const [isBasicPool, setIsBasicPool] = useState<boolean>(false)

  useEffect(() => {
    if (!traderPoolRegistry || !poolAddress) return
    ;(async () => {
      try {
        const isBase = await traderPoolRegistry.isBasicPool(poolAddress)
        setIsBasicPool(isBase)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [traderPoolRegistry, poolAddress])

  const TABS = [
    {
      title: "Open positions",
      source: generatePath(ROUTE_PATHS.fundPositions, {
        poolAddress: poolAddress ?? "",
        "*": "open",
      }),
    },
    {
      title: "Proposals",
      source: generatePath(ROUTE_PATHS.fundPositions, {
        poolAddress: poolAddress ?? "",
        "*": "proposals",
      }),
    },
    {
      title: "Closed positions",
      source: generatePath(ROUTE_PATHS.fundPositions, {
        poolAddress: poolAddress ?? "",
        "*": "closed",
      }),
    },
  ]

  const RISKY_PROPOSALS_TABS = [
    {
      title: "Open",
      source: generatePath(ROUTE_PATHS.fundPositions, {
        poolAddress: poolAddress ?? "",
        "*": "proposals/open",
      }),
    },
    {
      title: "Positions",
      source: generatePath(ROUTE_PATHS.fundPositions, {
        poolAddress: poolAddress ?? "",
        "*": "proposals/positions",
      }),
    },
    {
      title: "Closed",
      source: generatePath(ROUTE_PATHS.fundPositions, {
        poolAddress: poolAddress ?? "",
        "*": "proposals/closed",
      }),
    },
  ]

  return (
    <>
      <Header>{isMobile && "Fund Positions"}</Header>
      <S.Root>
        <S.HeadContainer>
          <S.PageTitle>All Proposals</S.PageTitle>
          <S.PageHeadTabs tabs={TABS} />
        </S.HeadContainer>
        <Routes>
          <>
            <Route
              path=""
              element={
                <Navigate
                  replace
                  to={generatePath(ROUTE_PATHS.fundPositions, {
                    poolAddress: poolAddress ?? "",
                    "*": "open",
                  })}
                />
              }
            />
            <Route path="open" element={<PoolPositionsList closed={false} />} />
            <Route
              path="closed"
              element={<PoolPositionsList closed={true} />}
            />
          </>
          <>
            <Route
              path="proposals"
              element={
                isBasicPool ? (
                  <Navigate
                    replace
                    to={generatePath(ROUTE_PATHS.fundPositions, {
                      poolAddress: poolAddress ?? "",
                      "*": "proposals/open",
                    })}
                  />
                ) : (
                  <PoolInvestProposalsList />
                )
              }
            />
            {isBasicPool && (
              <>
                <Route
                  path="proposals/open"
                  element={
                    <>
                      <S.PageSubTabs tabs={RISKY_PROPOSALS_TABS} />
                      <PoolRiskyProposalsList />
                    </>
                  }
                />
                <Route
                  path="proposals/positions"
                  element={
                    <>
                      <S.PageSubTabs tabs={RISKY_PROPOSALS_TABS} />
                      <PoolRiskyPositionsList closed={false} />
                    </>
                  }
                />
                <Route
                  path="proposals/closed"
                  element={
                    <>
                      <S.PageSubTabs tabs={RISKY_PROPOSALS_TABS} />
                      <PoolRiskyPositionsList closed={true} />
                    </>
                  }
                />
              </>
            )}
            <Route
              path="proposals/*"
              element={
                <Navigate
                  replace
                  to={generatePath(ROUTE_PATHS.fundPositions, {
                    poolAddress: poolAddress ?? "",
                    "*": "proposals",
                  })}
                />
              }
            />
          </>
          <Route path="/" element={<Navigate replace to={TABS[0].source} />} />
        </Routes>
      </S.Root>
    </>
  )
}

export default PoolPositions
