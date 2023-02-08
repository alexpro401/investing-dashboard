import { FC, useMemo, useState, useEffect } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { v4 as uuidv4 } from "uuid"

import { InvestorInvestProposalsQuery } from "queries"
import { useTraderPoolInvestProposalContract } from "contracts"
import { IInvestProposalInfo } from "interfaces/contracts/ITraderPoolInvestProposal"

import LoadMore from "components/LoadMore"
import InvestProposalCard from "components/cards/proposal/Invest"

import { RequestDividendsProvider } from "modals/RequestDividend/useRequestDividendsContext"

import { IInvestProposal } from "interfaces/thegraphs/invest-pools"
import { isEmpty } from "lodash"
import { graphClientInvestPools } from "utils/graphClient"
import { Center } from "theme"
import { NoDataMessage } from "common"
import { useGetPoolsUserInvestedIn, useQueryPagination } from "hooks"
import { useWeb3React } from "@web3-react/core"

interface IInvestProposalCardInitializer {
  poolAddress?: string
  proposalId: number
}

function InvestProposalCardInitializer({
  poolAddress,
  proposalId,
}: IInvestProposalCardInitializer) {
  const proposalPool = useTraderPoolInvestProposalContract(poolAddress)
  const [proposal, setProposal] = useState<IInvestProposalInfo[0] | null>(null)

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

  if (!poolAddress || proposal === null || !proposalPool) {
    return null
  }

  return <InvestProposalCard proposal={proposal} poolAddress={poolAddress} />
}

interface IProps {
  invested: boolean
}

const InvestorInvestProposalsList: FC<IProps> = ({ invested }) => {
  const { account } = useWeb3React()

  const preparedAccount = useMemo(() => {
    if (!account) return
    return String(account).toLowerCase()
  }, [account])

  const [activePools, loadingActivePools] = useGetPoolsUserInvestedIn(
    preparedAccount,
    "INVEST_POOL"
  )

  const [{ data, loading: loadingProposals }, fetchMore] =
    useQueryPagination<IInvestProposal>({
      query: InvestorInvestProposalsQuery(invested),
      variables: useMemo(() => ({ activePools }), [activePools]),
      pause: useMemo(
        () => isEmpty(activePools) || loadingActivePools,
        [activePools, loadingActivePools]
      ),
      context: graphClientInvestPools,
      formatter: (d) => d.proposals,
    })

  const loading = useMemo(
    () => loadingProposals || loadingActivePools,
    [loadingProposals, loadingActivePools]
  )

  if (isEmpty(data) && loading) {
    return (
      <Center>
        <PulseSpinner />
      </Center>
    )
  }

  if (isEmpty(data) && !loading) {
    return <NoDataMessage />
  }

  return (
    <>
      <RequestDividendsProvider>
        {data.map((p) => (
          <InvestProposalCardInitializer
            key={uuidv4()}
            proposalId={Number(p.id.substring(p.id.length - 1)) - 1}
            poolAddress={p.investPool.id}
          />
        ))}
        <LoadMore isLoading={loading && !!data.length} handleMore={fetchMore} />
      </RequestDividendsProvider>
    </>
  )
}

export default InvestorInvestProposalsList
