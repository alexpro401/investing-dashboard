import { CSSProperties, useCallback, useMemo, useState } from "react"
import { Currency, Token } from "lib/entities"
import { FixedSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"

import Search from "components/Search"

import WalletToken from "./WalletToken"
import PoolToken from "./PoolToken"
import * as S from "./styled"
import { useUnsupportedTokens, useUserTokens } from "hooks/useToken"
import BlacklistToken from "./BlacklistToken"
import useAlert, { AlertType } from "hooks/useAlert"
import theme, { Text } from "theme"
import ImportRow from "./ImportRow"
import { useUserAddedTokens } from "state/user/hooks"

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : "ETHER"
}

interface Props {
  customToken?: Token
  currencies: Token[]
  query: string
  poolAddress?: string
  onSelect: (token: Currency) => void
  handleChange: (v: string) => void
  showImportToken: (token: Token) => void
}

interface TokenRowProps {
  data: Array<Currency>
  index: number
  style: CSSProperties
}

const TokensList: React.FC<Props> = ({
  customToken,
  poolAddress,
  currencies,
  query,
  onSelect,
  handleChange,
  showImportToken,
}) => {
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

  const blacklist = useUnsupportedTokens()

  const blacklistTokensAdresses = useMemo(
    () => Object.values(blacklist ?? {}).map((t) => t.address),
    [blacklist]
  )

  const Row = useCallback(
    ({ data, index, style }: TokenRowProps) => {
      const token = data[index]

      const address = currencyKey(token)
      const isBlacklisted = blacklistTokensAdresses.includes(
        token.wrapped.address
      )
      const isUserAdded = token.wrapped.address in userAddedTokens

      if (isBlacklisted) {
        return (
          <BlacklistToken
            address={address}
            style={style}
            onClick={onBlacklistSelect}
            currency={token}
          />
        )
      }

      if (poolAddress) {
        return (
          <PoolToken
            isUserAdded={isUserAdded}
            poolAddress={poolAddress}
            address={address}
            style={style}
            onClick={onSelect}
            currency={token}
          />
        )
      }

      return (
        <WalletToken
          isUserAdded={isUserAdded}
          address={address}
          style={style}
          onClick={onSelect}
          currency={token}
        />
      )
    },
    [
      blacklistTokensAdresses,
      userAddedTokens,
      poolAddress,
      onSelect,
      onBlacklistSelect,
    ]
  )

  const list = (
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

  const importToken = customToken && (
    <ImportRow importToken={showImportToken} token={customToken} />
  )
  const noItems = importToken || (
    <S.Placeholder>No results found.</S.Placeholder>
  )

  return (
    <S.Card>
      <S.CardHeader>
        <Search
          placeholder="Name, ticker, address"
          value={query}
          handleChange={handleChange}
          height="40px"
        />
      </S.CardHeader>
      <S.CardList style={{ minHeight: 400 }}>
        {!!itemData.length ? list : noItems}
      </S.CardList>
    </S.Card>
  )
}

export default TokensList
