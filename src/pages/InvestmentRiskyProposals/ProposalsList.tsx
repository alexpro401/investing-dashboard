import { FC, useMemo } from "react"
import { PulseSpinner } from "react-spinners-kit"

import { useActiveWeb3React } from "hooks"
import { usePoolContract } from "hooks/usePool"
import { RiskyProposal } from "constants/interfaces_v2"
import { useRiskyProposalContract } from "hooks/useContract"
import useInvestorRiskyProposals from "hooks/useInvestorRiskyProposals"

import RiskyProposalCard from "components/cards/proposal/Risky"

import S from "./styled"

interface IProps {
  activePools: string[]
}

interface IRiskyCardInitializer {
  index: number
  account: string
  poolAddress: string
  proposal: RiskyProposal
}

const RiskyProposalCardInitializer: FC<IRiskyCardInitializer> = ({
  index,
  account,
  poolAddress,
  proposal,
}) => {
  const [proposalPool] = useRiskyProposalContract(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }

    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  if (!proposal || !poolInfo || !proposalPool) {
    return null
  }

  return (
    <RiskyProposalCard
      proposalId={index}
      poolInfo={poolInfo}
      isTrader={isTrader}
      proposal={proposal}
      poolAddress={poolAddress}
      proposalPool={proposalPool}
    />
  )
}

const InvestmentRiskyProposalsList: FC<IProps> = ({ activePools }) => {
  const { account } = useActiveWeb3React()
  const [proposals, fetched] = useInvestorRiskyProposals(activePools)

  if (!fetched || !account) {
    return (
      <S.Content>
        <PulseSpinner />
      </S.Content>
    )
  }

  if (fetched && proposals && proposals.length === 0) {
    return (
      <S.Content>
        <S.WithoutData>No proposal yet</S.WithoutData>
      </S.Content>
    )
  }

  return (
    <>
      <S.List>
        {proposals.map((p, i) => (
          <RiskyProposalCardInitializer
            key={p.poolAddress + i}
            index={i + 1}
            account={account}
            proposal={p.proposal}
            poolAddress={p.poolAddress}
          />
        ))}
      </S.List>
    </>
  )
}

export default InvestmentRiskyProposalsList
