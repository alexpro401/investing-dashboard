import { CSSProperties, FC, useMemo } from "react"

import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { normalizeBigNumber } from "utils"

import TokenIcon from "components/TokenIcon"
import { Currency } from "lib/entities"
import { useWeb3React } from "@web3-react/core"
import { useCurrencyBalance } from "hooks/useBalance"
import { parseEther } from "@ethersproject/units"

import * as S from "./styled"

interface Props {
  address: string
  currency: Currency
  style: CSSProperties
  onClick: (token: Currency) => void
}

const Token: FC<Props> = ({ address, currency, style, onClick }) => {
  const { symbol, name } = currency
  const { account } = useWeb3React()

  const token = currency.isToken ? currency : undefined
  const balance = useCurrencyBalance(account ?? undefined, token)

  const usdPriceParams = useMemo(
    () => ({
      tokenAddress: address,
      amount: parseEther(balance?.toSignificant(4) || "1"),
    }),
    [address, balance]
  )

  const price = useTokenPriceOutUSD(usdPriceParams)

  return (
    <S.TokenContainer style={style} onClick={() => onClick(currency)}>
      <TokenIcon address={address} size={30} />
      <S.TokenInfo>
        <S.Symbol>{symbol}</S.Symbol>
        <S.Name>{name}</S.Name>
      </S.TokenInfo>
      <S.BalanceInfo>
        {balance && <S.TokenBalance>{balance.toSignificant(4)}</S.TokenBalance>}
        {!price.isZero() && (
          <S.TokenPrice>${normalizeBigNumber(price, 18, 2)}</S.TokenPrice>
        )}
      </S.BalanceInfo>
    </S.TokenContainer>
  )
}

export default Token
