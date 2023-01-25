import { FC, useMemo } from "react"
import { PulseSpinner } from "react-spinners-kit"

import { useActiveWeb3React } from "hooks"
import { usePoolContract } from "hooks/usePool"
import useRiskyProposals from "hooks/useRiskyProposals"
import { useTraderPoolRiskyProposalContract } from "contracts"

import { Flex } from "theme"
import { NoDataMessage } from "common"
import LoadMore from "components/LoadMore"
import RiskyProposalCard from "components/cards/proposal/Risky"

interface IProps {
  poolAddress?: string
}

const FundProposalsRisky: FC<IProps> = ({ poolAddress }) => {
  const { account } = useActiveWeb3React()
  const proposalPool = useTraderPoolRiskyProposalContract(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)
  const [{ data, loading }, fetchMore] = useRiskyProposals(poolAddress)

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }
    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  if (
    !poolAddress ||
    !proposalPool ||
    !poolInfo ||
    (data.length === 0 && loading)
  ) {
    return (
      <Flex full ai="center" jc="center">
        <PulseSpinner />
      </Flex>
    )
  }

  if (data && data.length === 0 && !loading) {
    return <NoDataMessage />
  }

  return (
    <>
      {data.map((proposal, index) => (
        <RiskyProposalCard
          key={index}
          proposalId={index}
          proposal={proposal}
          poolInfo={poolInfo}
          poolAddress={poolAddress}
          proposalPool={proposalPool}
          isTrader={isTrader}
        />
      ))}
      <LoadMore isLoading={loading} handleMore={fetchMore} />
    </>
  )
}

export default FundProposalsRisky
