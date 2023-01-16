import { useMemo } from "react"
import { Routes, Route } from "react-router-dom"

import InvestProposalsList from "./ProposalsList"

import { ITab } from "interfaces"
import { useActiveWeb3React } from "hooks"
import useInvestorProposalPools from "hooks/useInvestorProposalPools"
import * as S from "./styled"

const InvestmentInvestProposals = () => {
  const { account } = useActiveWeb3React()

  const preparedAccount = useMemo(() => {
    if (!account) return
    return String(account).toLowerCase()
  }, [account])

  const activePools = useInvestorProposalPools(preparedAccount, "INVEST_POOL")

  const tabs: ITab[] = [
    {
      title: "New",
      source: `/investment/invest-proposals/new`,
    },
    {
      title: "Invested",
      source: `/investment/invest-proposals/invested`,
    },
  ]

  return (
    <>
      <S.PageSubTabs tabs={tabs} />
      <Routes>
        <Route
          path="new"
          element={
            <InvestProposalsList activePools={activePools} invested={false} />
          }
        ></Route>
        <Route
          path="invested"
          element={
            <InvestProposalsList activePools={activePools} invested={true} />
          }
        ></Route>
      </Routes>
    </>
  )
}

export default InvestmentInvestProposals
