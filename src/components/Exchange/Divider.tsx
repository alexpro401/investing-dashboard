import { Fragment } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { EXCHANGE_DEFAULT_PERCENTS } from "constants/index"

import { DividerContainer, PercentButton, SwapButton, Icon } from "./styled"
import DirectionIcon from "assets/icons/SwapDirectionIcon"
import DirectionButton from "assets/icons/SwapDirectionButton"

interface IDividerProps {
  changeAmount: (v: BigNumber) => void
  changeDirection?: () => void
  points?: { id: string; label: string; percent: BigNumber }[]
}

const ExchangeDivider: React.FC<IDividerProps> = ({
  changeAmount,
  changeDirection,
  points,
}) => {
  const buttonsList = points || EXCHANGE_DEFAULT_PERCENTS

  return (
    <DividerContainer full>
      {buttonsList.map((point, index) => (
        <Fragment key={point.id}>
          <PercentButton
            active={false}
            onClick={() => changeAmount(point.percent)}
          >
            {point.label}
          </PercentButton>
          {index + 1 === buttonsList.length / 2 && (
            <SwapButton onClick={() => !!changeDirection && changeDirection()}>
              {!changeDirection ? <DirectionIcon /> : <DirectionButton />}
            </SwapButton>
          )}
        </Fragment>
      ))}
    </DividerContainer>
  )
}

export default ExchangeDivider
