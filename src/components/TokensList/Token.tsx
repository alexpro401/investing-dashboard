import { FC } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { Token as IToken } from "interfaces"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { formatBigNumber, normalizeBigNumber } from "utils"

import TokenIcon from "components/TokenIcon"
import {
  TokenContainer,
  TokenInfo,
  Symbol,
  Name,
  BalanceInfo,
  TokenBalance,
  TokenPrice,
} from "./styled"
import { ZERO } from "constants/index"

const Token: FC<{
  tokenData: IToken
  balance?: BigNumber
  onClick: (token: IToken) => void
}> = ({ tokenData, balance, onClick }) => {
  const { symbol, name, address } = tokenData

  const price = useTokenPriceOutUSD({ tokenAddress: address })

  const balanceFormated = formatBigNumber(balance || ZERO, 18)

  return (
    <TokenContainer onClick={() => onClick(tokenData)}>
      <TokenIcon address={address} size={30} />
      <TokenInfo>
        <Symbol>{symbol}</Symbol>
        <Name>{name}</Name>
      </TokenInfo>
      <BalanceInfo>
        <TokenBalance>{balanceFormated}</TokenBalance>
        <TokenPrice>${normalizeBigNumber(price, 18, 2)}</TokenPrice>
      </BalanceInfo>
    </TokenContainer>
  )
}

export default Token
