import { INftTile } from "interfaces/exchange"
import { FC } from "react"
import { normalizeBigNumber } from "utils"
import * as S from "./styled"

interface Props extends INftTile {
  isSelected?: boolean
}

const Tile: FC<Props> = ({
  votingPower,
  tokenId,
  tokenUri,
  isSelected = false,
}) => {
  return (
    <S.Card url={tokenUri}>
      <S.CardInfo>
        <S.NftId>#{tokenId}</S.NftId>
        <S.VotingPowerAmount>
          {normalizeBigNumber(votingPower, 18, 2)}
        </S.VotingPowerAmount>
      </S.CardInfo>
    </S.Card>
  )
}

export default Tile
