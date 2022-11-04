import { FC } from "react"
import * as S from "./styled"
import NftIcon from "components/NftIcon"
import { INftTile } from "interfaces/exchange"

const NftTile: FC<INftTile> = ({ votingPower, tokenId, tokenUri }) => {
  return (
    <S.Container>
      <S.VotingPower>Voting power: 0</S.VotingPower>
      <S.RightNode>
        <S.TokenId>#{tokenId}</S.TokenId>
        <NftIcon url={tokenUri} />
      </S.RightNode>
    </S.Container>
  )
}

export default NftTile
