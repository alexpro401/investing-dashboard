import { CSSProperties, FC, useMemo } from "react"
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
import { Currency } from "lib/entities"
import { useWeb3React } from "@web3-react/core"
import { useCurrencyBalance, useFundBalance } from "hooks/useBalance"
import { parseEther } from "@ethersproject/units"

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
    <TokenContainer style={style} onClick={() => onClick(currency)}>
      <TokenIcon address={address} size={30} />
      <TokenInfo>
        <Symbol>{symbol}</Symbol>
        <Name>{name}</Name>
      </TokenInfo>
      <BalanceInfo>
        {balance && <TokenBalance>{balance.toSignificant(4)}</TokenBalance>}
        {!price.isZero() && (
          <TokenPrice>${normalizeBigNumber(price, 18, 2)}</TokenPrice>
        )}
      </BalanceInfo>
    </TokenContainer>
  )
}

export default PoolToken
