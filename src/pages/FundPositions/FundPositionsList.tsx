import { FC } from "react"
import { useParams } from "react-router-dom"
import { PulseSpinner } from "react-spinners-kit"

import PoolPositionCard from "components/cards/position/Pool"

import { usePoolPositions } from "state/pools/hooks"

import S from "./styled"

const FundPositionsList: FC<{ closed: boolean }> = ({ closed }) => {
  const { poolAddress } = useParams()
  const positions = usePoolPositions(poolAddress, closed)

  if (!positions) {
    return (
      <S.Content>
        <PulseSpinner />
      </S.Content>
    )
  }

  if (positions && positions.length === 0) {
    return (
      <S.Content>
        <S.WithoutData>No {closed ? "closed" : "open"} positions</S.WithoutData>
      </S.Content>
    )
  }

  return (
    <>
      <S.List>
        {positions.map((position) => (
          <PoolPositionCard key={position.id} position={position} />
        ))}
      </S.List>
    </>
  )
}

export default FundPositionsList
