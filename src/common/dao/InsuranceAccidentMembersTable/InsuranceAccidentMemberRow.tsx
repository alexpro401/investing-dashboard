import { FC, useMemo } from "react"
import * as S from "./styled"
import { normalizeBigNumber, shortenAddress } from "utils"
import { BigNumber } from "@ethersproject/bignumber"
import { isNil } from "lodash"
import { ZERO } from "constants/index"
import { divideBignumbers } from "utils/formulas"
import { InsuranceAccidentInvestor } from "interfaces/insurance"
import { useBreakpoints } from "hooks"
import { ICON_NAMES } from "constants/icon-names"
import { Flex } from "theme"

interface Props {
  payload: InsuranceAccidentInvestor
  active?: boolean
  fw?: number
  gap?: string
}

const InsuranceAccidentMemberRow: FC<Props> = ({ payload, ...rest }) => {
  const { isMobile } = useBreakpoints()
  const address = shortenAddress(payload.investor.id)

  const inDayLpAmount = useMemo(() => {
    if (!payload) {
      return { big: ZERO, format: "0.0" }
    }

    const big = BigNumber.from(
      payload.poolPositionBeforeAccident.lpHistory[0].currentLpAmount
    )
    return { big, format: normalizeBigNumber(big, 18, 3) }
  }, [payload])

  const currentLPAmount = useMemo(() => {
    if (isNil(payload)) return ZERO

    const { totalLPInvestVolume, totalLPDivestVolume } =
      payload.poolPositionOnAccidentCreation

    return divideBignumbers(
      [BigNumber.from(totalLPInvestVolume), 18],
      [BigNumber.from(totalLPDivestVolume), 18]
    )
  }, [payload])

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

  const stakeUSD = useMemo(() => {
    if (!payload || !payload?.stakeUSD) return "0.0"

    const big = BigNumber.from(payload.stakeUSD)
    return normalizeBigNumber(big, 18, 2)
  }, [payload])

  return (
    <S.TableBodyRow {...rest}>
      <S.TableCell>
        {!isMobile && rest?.active ? (
          <Flex ai={"center"} jc={"flex-start"} gap={"4"}>
            <S.TableCellActiveIcon name={ICON_NAMES.user} />
            {address}
          </Flex>
        ) : (
          address
        )}
      </S.TableCell>
      <S.TableCell>{inDayLpAmount.format}</S.TableCell>
      <S.TableCell>{loss}</S.TableCell>
      <S.TableCell>
        {stake}
        &nbsp;
        {!isMobile ? <span>$ {stakeUSD}</span> : <></>}
      </S.TableCell>
    </S.TableBodyRow>
  )
}

export default InsuranceAccidentMemberRow
