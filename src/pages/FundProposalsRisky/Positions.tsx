import { FC, useMemo } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { createClient, Provider as GraphProvider } from "urql"

import { useActiveWeb3React } from "hooks"
import { usePoolContract } from "hooks/usePool"
import useRiskyPositions from "hooks/useRiskyPositions"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"

import RiskyPositionCard from "components/cards/position/Risky"

import S from "./styled"

const poolClient = createClient({
  url: process.env.REACT_APP_BASIC_POOLS_API_URL || "",
})

interface IProps {
  poolAddress: string
  closed: boolean
}

const FundPositionsRisky: FC<IProps> = ({ poolAddress, closed }) => {
  const { account } = useActiveWeb3React()
  const [, poolInfo] = usePoolContract(poolAddress)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const positions = useRiskyPositions(poolAddress, closed)

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }

    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  if (!positions || !poolInfo || !poolMetadata) {
    return (
      <S.ListLoading full ai="center" jc="center">
        <PulseSpinner />
      </S.ListLoading>
    )
  }

  if (positions && positions.length === 0) {
    return (
      <S.ListLoading full ai="center" jc="center">
        <S.WithoutData>No positions</S.WithoutData>
      </S.ListLoading>
    )
  }

  return (
    <>
      {positions.map((p) => (
        <RiskyPositionCard
          key={p.id}
          position={p}
          isTrader={isTrader}
          poolInfo={poolInfo}
          poolMetadata={poolMetadata}
        />
      ))}
    </>
  )
}

const FundPositionssRiskyWithPorvider = (props) => {
  return (
    <GraphProvider value={poolClient}>
      <FundPositionsRisky {...props} />
    </GraphProvider>
  )
}

export default FundPositionssRiskyWithPorvider
