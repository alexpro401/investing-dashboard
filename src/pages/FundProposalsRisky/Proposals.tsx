import { useMemo } from "react"
import { PulseSpinner } from "react-spinners-kit"

import { useActiveWeb3React } from "hooks"
import { usePoolContract } from "hooks/usePool"
import { useRiskyProposalContract } from "hooks/useContract"

import RiskyProposalCard from "components/cards/proposal/Risky"

import S from "./styled"

const FundProposalsRisky = ({ data, poolAddress }) => {
  const { account } = useActiveWeb3React()
  const [proposalPool] = useRiskyProposalContract(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }

    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  if (!proposalPool || !poolInfo) {
    return (
      <S.ListLoading full ai="center" jc="center">
        <PulseSpinner />
      </S.ListLoading>
    )
  }

  return (
    <>
      {data.map((proposal, index) => (
        <RiskyProposalCard
          key={index}
          proposalId={index + 1}
          proposal={proposal}
          poolInfo={poolInfo}
          poolAddress={poolAddress}
          proposalPool={proposalPool}
          isTrader={isTrader}
        />
      ))}
    </>
  )
}

export default FundProposalsRisky
