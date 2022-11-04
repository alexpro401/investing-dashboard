import { FC, HTMLAttributes } from "react"
import * as S from "./styled"
import NftIcon from "components/NftIcon"
import { INftTile } from "interfaces/exchange"
import { normalizeBigNumber } from "utils"

interface Props extends INftTile {
  isLocked?: boolean
}

/*
  * NftTile component
  representation of NFT row in the list of NFTs

  @param isLocked - used to show if the NFT is used in voting
  @param votingPower - used to show the voting power of the NFT
  @param tokenId - used to show the tokenId of the NFT
  @param tokenUri - used to show the tokenUri of the NFT
*/
const NftTile: FC<Props & HTMLAttributes<HTMLDivElement>> = (props) => {
  const { votingPower, tokenId, tokenUri, isLocked, ...rest } = props

  return (
    <S.Container {...rest}>
      <S.VotingPower>
        Voting power: {normalizeBigNumber(votingPower, 18, 2)}
      </S.VotingPower>
      <S.RightNode>
        <S.TokenId>#{tokenId}</S.TokenId>
        <NftIcon url={tokenUri} isLocked={isLocked} />
      </S.RightNode>
    </S.Container>
  )
}

export default NftTile
