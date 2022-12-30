import { BigNumber } from "@ethersproject/bignumber"
import { ZERO } from "consts"
import useProposalAddress from "hooks/useProposalAddress"
import useInvestProposalData from "hooks/useInvestProposalData"
import { FC, useEffect, useState } from "react"
import { normalizeBigNumber } from "utils"
import * as S from "./styled"
import { DividendToken } from "./useRequestDividend"

interface Props {
  token: DividendToken
  poolAddress: string
  proposalId: string
}

const Tile: FC<Props> = ({ token, poolAddress, proposalId }) => {
  const [dividendsAvailable, setDividendsAvailable] = useState(ZERO)

  const proposalAddress = useProposalAddress(poolAddress)
  const proposalData = useInvestProposalData(
    proposalAddress.toLocaleLowerCase() + (parseFloat(proposalId) + 1)
  )

  useEffect(() => {
    if (!proposalData) return

    try {
      const totalUSD = BigNumber.from(proposalData.totalUSDSupply)

      setDividendsAvailable(totalUSD)
    } catch {}
  }, [proposalData])

  return (
    <S.Tile>
      {token.icon}
      <S.TextContainer ai="flex-start">
        <S.TextWhite>{token.symbol}</S.TextWhite>
        <S.FundName>{token.name}</S.FundName>
      </S.TextContainer>
      <S.TextContainer ai="flex-end">
        <S.TextWhite>
          ${normalizeBigNumber(dividendsAvailable, 18, 2)}
        </S.TextWhite>
        <S.TextGray>Dividends available</S.TextGray>
      </S.TextContainer>
    </S.Tile>
  )
}

export default Tile
