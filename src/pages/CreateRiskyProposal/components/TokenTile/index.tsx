import { FC } from "react"
import TokenIcon from "components/TokenIcon"
import { useTokenPriceOutUSD } from "hooks"
import * as S from "./styled"
import * as TokensListS from "components/TokensList/styled"
import { normalizeBigNumber } from "utils"
import { useERC20Data } from "state/erc20/hooks"

interface Props {
  tokenAddress?: string
}

const TokenTile: FC<Props> = ({ tokenAddress }) => {
  const price = useTokenPriceOutUSD({
    tokenAddress,
  })

  const [tokenData] = useERC20Data(tokenAddress)

  return (
    <S.TokenContainer>
      <TokenIcon address={tokenAddress} size={32} />
      <S.TokenInfo>
        <TokensListS.Symbol>{tokenData?.symbol}</TokensListS.Symbol>
        <TokensListS.Name>{tokenData?.name}</TokensListS.Name>
      </S.TokenInfo>
      {!!price && <S.Price>${normalizeBigNumber(price, 18, 2)}</S.Price>}
    </S.TokenContainer>
  )
}

export default TokenTile
