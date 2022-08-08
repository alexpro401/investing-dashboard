import { FC, useMemo, useState, useEffect, useRef } from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { PulseSpinner } from "react-spinners-kit"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { InvestorInvestProposalsQuery } from "queries"
import { InvestProposal } from "constants/interfaces_v2"
import useQueryPagination from "hooks/useQueryPagination"
import { useInvestProposalContract } from "hooks/useContract"

import LoadMore from "components/LoadMore"
import InvestProposalCard from "components/cards/proposal/Invest"

import S from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_INVEST_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

interface IInvestProposalCardInitializer {
  poolAddress: string
  proposalId: number
}

function InvestProposalCardInitializer({
  poolAddress,
  proposalId,
}: IInvestProposalCardInitializer) {
  const [proposalPool] = useInvestProposalContract(poolAddress)
  const [proposal, setProposal] = useState<InvestProposal | null>(null)

  useEffect(() => {
    if (!proposalPool || !poolAddress) return
    ;(async () => {
      try {
        const data = await proposalPool.getProposalInfos(proposalId, 1)
        if (data && data[0]) {
          setProposal(data[0])
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [poolAddress, proposalId, proposalPool])

  if (proposal === null || !proposalPool) {
    return null
  }

  return <InvestProposalCard proposal={proposal} poolAddress={poolAddress} />
}

interface IProps {
  activePools: string[]
  invested: boolean
}

const InvestmentInvestProposalsList: FC<IProps> = ({
  activePools,
  invested,
}) => {
  const variables = useMemo(() => ({ activePools }), [activePools])

  const normalizeCollection = (d) =>
    d.proposals.map((p) => ({
      id: String(p.id).slice(42),
      poolAddress: p.investPool.id,
    }))

  const [{ data, error, loading }, fetchMore] = useQueryPagination(
    InvestorInvestProposalsQuery(invested),
    variables,
    normalizeCollection
  )

  const loader = useRef<any>()

  // manually disable scrolling *refresh this effect when ref container dissapeared from DOM
  useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  if (!data || (data.length === 0 && loading)) {
    return (
      <S.Content>
        <PulseSpinner />
      </S.Content>
    )
  }

  if (data && data.length === 0 && !loading) {
    return (
      <S.Content>
        <S.WithoutData>No proposals yet</S.WithoutData>
      </S.Content>
    )
  }

  return (
    <>
      <S.List ref={loader}>
        {data.map((p) => (
          <InvestProposalCardInitializer
            key={p.poolAddress + p.id}
            proposalId={Number(p.id) - 1}
            poolAddress={p.poolAddress}
          />
        ))}
        <LoadMore
          isLoading={loading && !!data.length}
          handleMore={fetchMore}
          r={loader}
        />
      </S.List>
    </>
  )
}

const InvestmentInvestProposalsListWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <InvestmentInvestProposalsList {...props} />
    </GraphProvider>
  )
}

export default InvestmentInvestProposalsListWithProvider
