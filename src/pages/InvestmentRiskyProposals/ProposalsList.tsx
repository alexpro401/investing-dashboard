import { FC, useMemo } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { v4 as uuidv4 } from "uuid"
import { isEmpty, map } from "lodash"

import {
  usePoolContract,
  useActiveWeb3React,
  useInvestorRiskyProposals,
} from "hooks"
import { useTraderPoolRiskyProposalContract } from "contracts"

import LoadMore from "components/LoadMore"
import RiskyProposalCard from "components/cards/proposal/Risky"

import { IRiskyProposalInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"
import { NoDataMessage } from "common"
import { Center } from "theme"

interface IRiskyCardInitializer {
  account: string
  poolAddress: string
  proposalId: number

  proposal: IRiskyProposalInfo[0]
}

function RiskyProposalCardInitializer({
  account,
  poolAddress,
  proposalId,
  proposal,
}: IRiskyCardInitializer) {
  const proposalPool = useTraderPoolRiskyProposalContract(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }

    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  if (proposal === null || !poolInfo || !proposalPool) {
    return null
  }

  return (
    <RiskyProposalCard
      proposalId={proposalId}
      poolInfo={poolInfo}
      isTrader={isTrader}
      proposal={proposal}
      poolAddress={poolAddress}
      proposalPool={proposalPool}
    />
  )
}

interface IProps {
  activePools?: string[]
}

const InvestmentRiskyProposalsList: FC<IProps> = ({ activePools }) => {
  const { account } = useActiveWeb3React()

  const [data, proposals, loading, fetchMore] =
    useInvestorRiskyProposals(activePools)

  const isPayloadEmpty = useMemo(
    () => isEmpty(data) || isEmpty(proposals),
    [data, proposals]
  )

  if (!account || (isPayloadEmpty && loading)) {
    return (
      <Center>
        <PulseSpinner />
      </Center>
    )
  }

  if (isPayloadEmpty && !loading) {
    return <NoDataMessage />
  }

  return (
    <>
      {map(data, (p, index) => (
        <RiskyProposalCardInitializer
          key={uuidv4()}
          account={account}
          proposalId={Number(String(p.id).charAt(String(p.id).length - 1)) - 1}
          poolAddress={p.basicPool.id}
          proposal={proposals[index]}
        />
      ))}
      <LoadMore isLoading={loading} handleMore={fetchMore} />
    </>
  )
}

export default InvestmentRiskyProposalsList
