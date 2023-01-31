import { useParams } from "react-router-dom"
import { PulseSpinner } from "react-spinners-kit"

import useInvestProposals from "hooks/useInvestmentProposals"

import { NoDataMessage } from "common"
import LoadMore from "components/LoadMore"
import InvestProposalCard from "components/cards/proposal/Invest"
import { RequestDividendsProvider } from "modals/RequestDividend/useRequestDividendsContext"

const FundProposalsInvest = () => {
  const { poolAddress } = useParams()

  const [{ data, loading }, fetchMore] = useInvestProposals(poolAddress)

  if (!poolAddress || !data) {
    return <PulseSpinner />
  }

  if (data && data.length === 0) {
    return <NoDataMessage />
  }

  return (
    <>
      {data.map((proposal, index) => (
        <InvestProposalCard
          key={index}
          proposal={proposal}
          poolAddress={poolAddress}
        />
      ))}
      <LoadMore isLoading={loading} handleMore={fetchMore} />
    </>
  )
}

const FundProposalsInvestWithProvider = (props) => {
  return (
    <RequestDividendsProvider>
      <FundProposalsInvest {...props} />
    </RequestDividendsProvider>
  )
}

export default FundProposalsInvestWithProvider
