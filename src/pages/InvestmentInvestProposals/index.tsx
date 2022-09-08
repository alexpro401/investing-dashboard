import { useMemo } from "react"
import { Routes, Route } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"

import RouteTabs from "components/RouteTabs"
import InvestProposalsList from "./ProposalsList"

import { ITab } from "interfaces"
import { useActiveWeb3React } from "hooks"
import useInvestorProposalPools from "hooks/useInvestorProposalPools"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

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
      <RouteTabs tabs={tabs} />
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

const InvestmentInvestProposalsWithProvider = () => (
  <GraphProvider value={poolsClient}>
    <InvestmentInvestProposals />
  </GraphProvider>
)

export default InvestmentInvestProposalsWithProvider
