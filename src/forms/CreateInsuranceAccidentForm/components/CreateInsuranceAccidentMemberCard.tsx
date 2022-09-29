import { FC, useMemo } from "react"
import * as S from "../styled/step-check-settings"
import { normalizeBigNumber, shortenAddress } from "utils"
import { BigNumber } from "@ethersproject/bignumber"
import { isNil } from "lodash"
import { ZERO } from "constants/index"
import { divideBignumbers } from "utils/formulas"

interface Props {
  payload: any
  lpHistory: any
  lpCurrent: any
  color?: string
  fw?: string | number
}

const CreateInsuranceAccidentMemberCard: FC<Props> = ({
  payload,
  lpHistory,
  lpCurrent,
  ...rest
}) => {
  const address = shortenAddress(payload.investor.id)

  const inDayLpAmount = useMemo(() => {
    if (!lpHistory) {
      return { big: ZERO, format: "0.0" }
    }

    const big = BigNumber.from(lpHistory.lpHistory.currentLpAmount)
    return { big, format: normalizeBigNumber(big, 18, 3) }
  }, [lpHistory])

  const currentLPAmount = useMemo(() => {
    if (isNil(lpCurrent)) return ZERO

    return divideBignumbers(
      [BigNumber.from(lpCurrent.totalLPInvestVolume), 18],
      [BigNumber.from(lpCurrent.totalLPDivestVolume), 18]
    )
  }, [lpCurrent])

  const loss = useMemo(() => {
    if (!currentLPAmount || !inDayLpAmount) {
      return "0.0"
    }
    const big = divideBignumbers([inDayLpAmount.big, 18], [currentLPAmount, 18])
    return normalizeBigNumber(big, 18, 3)
  }, [currentLPAmount, inDayLpAmount])

  const stake = useMemo(() => {
    if (!payload) {
      return "0.0"
    }
    const big = BigNumber.from(payload.stake).mul(10)
    return normalizeBigNumber(big, 18, 2)
  }, [payload])

  return (
    <S.TableRow {...rest}>
      <S.TableCell>{address}</S.TableCell>
      <S.TableCell>{inDayLpAmount.format}</S.TableCell>
      <S.TableCell>{loss}</S.TableCell>
      <S.TableCell>{stake}</S.TableCell>
    </S.TableRow>
  )
}

export default CreateInsuranceAccidentMemberCard
