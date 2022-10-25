import { CSSProperties, useCallback, useMemo } from "react"
import { Currency, Token } from "lib/entities"
import { FixedSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"

import {
  useUnsupportedTokens,
  useUserTokens,
  useWhitelistTokens,
} from "hooks/useToken"
import BlacklistToken from "./BlacklistToken"
import useAlert, { AlertType } from "hooks/useAlert"
import theme, { Text } from "theme"
import TokenRow from "./TokenRow"
import { CurrencyAmount } from "lib/entities/fractions/currencyAmount"

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : "ETHER"
}

interface Props {
  currencies: Token[]
  balances: { [tokenAddress: string]: CurrencyAmount<Token> | undefined }
  onSelect: (token: Currency) => void
}

interface TokenRowProps {
  data: Array<Currency>
  index: number
  style: CSSProperties
}

const TokensList: React.FC<Props> = ({ currencies, balances, onSelect }) => {
  const [showAlert] = useAlert()
  const userAddedTokens = useUserTokens()

  const itemData: Currency[] = useMemo(() => {
    return currencies
  }, [currencies])

  const itemKey = useCallback(
    (index: number, data: typeof itemData) => {
      const currency = data[index]

      return currencyKey(currency)
    },
    [itemData]
  )

  const onBlacklistSelect = useCallback(
    (currency: Currency) => {
      showAlert({
        type: AlertType.warning,
        content: (
          <Text
            color={theme.textColors.primary}
          >{`${currency.symbol} is blacklisted. When token is blacklisted it's not allowed to create a pool, trade or invest.`}</Text>
        ),
        hideDuration: 7000,
      })
    },
    [showAlert]
  )

  const whitelist = useWhitelistTokens()
  const blacklist = useUnsupportedTokens()

  const Row = useCallback(
    ({ data, index, style }: TokenRowProps) => {
      const token = data[index]

      const address = currencyKey(token)
      const isBlacklisted = token.wrapped.address in blacklist
      const isWhitelisted = token.wrapped.address in whitelist
      const isUserAdded = token.wrapped.address in userAddedTokens

      if (isBlacklisted) {
        return (
          <BlacklistToken
            balance={balances[address]}
            address={address}
            style={style}
            onClick={onBlacklistSelect}
            currency={token}
          />
        )
      }

      return (
        <TokenRow
          balance={balances[address]}
          isRisky={!isWhitelisted}
          isUserAdded={isUserAdded}
          address={address}
          style={style}
          onClick={onSelect}
          currency={token}
        />
      )
    },
    [
      blacklist,
      whitelist,
      userAddedTokens,
      balances,
      onSelect,
      onBlacklistSelect,
    ]
  )

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          itemData={itemData}
          itemCount={itemData.length}
          itemSize={60}
          itemKey={itemKey}
          height={height}
          width={width}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  )
}

export default TokensList
