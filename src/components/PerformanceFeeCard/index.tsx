import { format } from "date-fns"
import { FC, useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { expandTimestamp } from "utils"
import { DATE_FORMAT } from "constants/time"

import Button, { SecondaryButton } from "components/Button"
import { Container, ValueLabel, ArrowIcon } from "./styled"

interface Props {
  p?: string
  hasFee: boolean
  poolAddress?: string
  commisionUnlockTime?: number
  performanceFeePercent: string
}

const PerformanceFeeCard: FC<Props> = ({
  performanceFeePercent,
  commisionUnlockTime,
  hasFee,
  poolAddress,
  p = "0",
}) => {
  const navigate = useNavigate()

  const commisionUnlockDate = useMemo(() => {
    if (!!commisionUnlockTime) {
      return format(expandTimestamp(commisionUnlockTime), DATE_FORMAT)
    }
    return "-"
  }, [commisionUnlockTime])

  const handleCommissionRedirect = () => {
    navigate(`/fund-details/${poolAddress}/fee`)
  }

  const button = () => {
    if (hasFee) {
      return (
        <Button onClick={handleCommissionRedirect} m="0" size="small">
          Performance Fee {performanceFeePercent}%
          <ArrowIcon color="#0d1320" />
        </Button>
      )
    } else {
      return (
        <SecondaryButton m="0" size="small">
          Performance Fee {performanceFeePercent}%
          <ArrowIcon color="#788ab4" />
        </SecondaryButton>
      )
    }
  }

  return (
    <Container full p={p}>
      {button()}
      <ValueLabel>{commisionUnlockDate}</ValueLabel>
    </Container>
  )
}

export default PerformanceFeeCard
