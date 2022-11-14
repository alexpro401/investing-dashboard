import { INftTile } from "interfaces/exchange"
import { FC } from "react"
import { normalizeBigNumber } from "utils"
import * as S from "./styled"

interface Props extends INftTile {
  isSelected?: boolean
  onSelect: (tokenId: string) => void
  onDeselect: (tokenId: string) => void
}

const Tile: FC<Props> = ({
  votingPower,
  tokenId,
  tokenUri,
  isSelected = false,
  onSelect,
  onDeselect,
}) => {
  const handleClick = () => {
    if (isSelected) {
      onDeselect(tokenId)
    } else {
      onSelect(tokenId)
    }
  }

  return (
    <S.Card url={tokenUri} isSelected={isSelected} onClick={handleClick}>
      <S.Check />
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
