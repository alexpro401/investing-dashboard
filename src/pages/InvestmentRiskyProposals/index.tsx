import { useMemo } from "react"
import { Routes, Route } from "react-router-dom"

import RiskyProposalsList from "./ProposalsList"
import RiskyPositionsList from "./PositionsList"

import { ITab } from "interfaces"
import { useActiveWeb3React } from "hooks"
import useInvestorProposalPools from "hooks/useInvestorProposalPools"
import * as S from "./styled"

const InvestmentRiskyProposals = () => {
  const { account } = useActiveWeb3React()

  const preparedAccount = useMemo(() => {
    if (!account) return
    return String(account).toLowerCase()
  }, [account])

  const activePools = useInvestorProposalPools(preparedAccount, "BASIC_POOL")

  const tabs: ITab[] = [
    {
      title: "Risk proposals",
      source: `/investment/risk-proposals/open`,
    },
    {
      title: "Risk positions",
      source: `/investment/risk-proposals/positions`,
    },
    {
      title: "Closed",
      source: `/investment/risk-proposals/closed`,
    },
  ]

  return (
    <>
      <S.PageSubTabs tabs={tabs} />
      <Routes>
        <Route
          path="open"
          element={<RiskyProposalsList activePools={activePools} />}
        />
        <Route
          path="positions"
          element={
            <RiskyPositionsList activePools={activePools} closed={false} />
          }
        />
        <Route
          path="closed"
          element={
            <RiskyPositionsList activePools={activePools} closed={true} />
          }
        />
      </Routes>
    </>
  )
}

export default InvestmentRiskyProposals
