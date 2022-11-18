import { FC, HTMLAttributes } from "react"

import { INftTile } from "interfaces/exchange"

import NftIcon from "components/NftIcon"

import { normalizeBigNumber } from "utils"
import * as S from "./styled"

interface Props extends INftTile {
  isLocked?: boolean
}

/*
  * NftRow component - UI representation of NFT row in the list of DAO NFTs

  @param isLocked - used to show if the NFT is used in voting
  @param votingPower - used to show the voting power of the NFT
  @param tokenId - used to show the tokenId of the NFT
  @param tokenUri - used to show the tokenUri of the NFT
*/
const NftRow: FC<Props & HTMLAttributes<HTMLDivElement>> = (props) => {
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

export default NftRow
