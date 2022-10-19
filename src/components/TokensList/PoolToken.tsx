import { CSSProperties, FC, useMemo } from "react"

import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { normalizeBigNumber } from "utils"

import TokenIcon from "components/TokenIcon"
import { Currency } from "lib/entities"
import { useWeb3React } from "@web3-react/core"
import { useFundBalance } from "hooks/useBalance"
import { parseEther } from "@ethersproject/units"

import * as S from "./styled"

interface Props {
  poolAddress?: string
  address: string
  currency: Currency
  style: CSSProperties
  onClick: (token: Currency) => void
}

const PoolToken: FC<Props> = ({
  poolAddress,
  address,
  currency,
  style,
  onClick,
}) => {
  const { symbol, name } = currency
  const { account } = useWeb3React()

  const token = currency.isToken ? currency : undefined
  const balance = useFundBalance(poolAddress, account ?? undefined, token)
  // console.log(balance?.toSignificant(4))

  const price = useTokenPriceOutUSD({
    tokenAddress: address,
    amount: useMemo(
      () => parseEther(balance?.toSignificant(4) || "1"),
      [balance]
    ),
  })

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

export default PoolToken
