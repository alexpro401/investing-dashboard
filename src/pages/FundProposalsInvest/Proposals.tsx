import { useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { PulseSpinner } from "react-spinners-kit"
import { createClient, Provider as GraphProvider } from "urql"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import useInvestProposals from "hooks/useInvestmentProposals"

import LoadMore from "components/LoadMore"
import InvestProposalCard from "components/cards/proposal/Invest"

import { RequestDividendsProvider } from "modals/RequestDividend/useRequestDividendsContext"

import S from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_INVEST_POOLS_API_URL || "",
})

const FundProposalsInvest = () => {
  const { poolAddress } = useParams()

  const [{ data, loading }, fetchMore] = useInvestProposals(poolAddress)

  const loader = useRef<any>()

  useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  if (!poolAddress || !data) {
    return (
      <S.Content>
        <PulseSpinner />
      </S.Content>
    )
  }

  if (data && data.length === 0) {
    return (
      <S.Content>
        <S.WithoutData>No proposals</S.WithoutData>
      </S.Content>
    )
  }

  return (
    <S.Container ref={loader}>
      {data.map((proposal, index) => (
        <InvestProposalCard
          key={index}
          proposal={proposal}
          poolAddress={poolAddress}
        />
      ))}
      <LoadMore isLoading={loading} handleMore={fetchMore} r={loader} />
    </S.Container>
  )
}

const FundProposalsInvestWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <RequestDividendsProvider>
        <FundProposalsInvest {...props} />
      </RequestDividendsProvider>
    </GraphProvider>
  )
}

export default FundProposalsInvestWithProvider
