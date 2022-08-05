import { FC, useEffect, useMemo, useRef } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { useActiveWeb3React } from "hooks"
import { usePoolContract } from "hooks/usePool"
import useRiskyProposals from "hooks/useRiskyProposals"
import { useRiskyProposalContract } from "hooks/useContract"

import LoadMore from "components/LoadMore"
import RiskyProposalCard from "components/cards/proposal/Risky"

import S from "./styled"

interface IProps {
  poolAddress: string
}

const FundProposalsRisky: FC<IProps> = ({ poolAddress }) => {
  const { account } = useActiveWeb3React()
  const [proposalPool] = useRiskyProposalContract(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)
  const [{ data, loading }, fetchMore] = useRiskyProposals(poolAddress)

  const loader = useRef<any>()

  useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }
    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  if (!proposalPool || !poolInfo || (data.length === 0 && loading)) {
    return (
      <S.ListLoading full ai="center" jc="center">
        <PulseSpinner />
      </S.ListLoading>
    )
  }

  if (data && data.length === 0 && !loading) {
    return (
      <S.Content full ai="center" jc="center">
        <S.WithoutData>No proposals</S.WithoutData>
      </S.Content>
    )
  }

  return (
    <S.List ref={loader}>
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
      <LoadMore isLoading={loading} handleMore={fetchMore} r={loader} />
    </S.List>
  )
}

export default FundProposalsRisky
