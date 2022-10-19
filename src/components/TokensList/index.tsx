import { CSSProperties, useCallback, useMemo } from "react"
import { Currency, Token } from "lib/entities"
import { FixedSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"

import Search from "components/Search"

import CurrencyRow from "./Token"
import PoolToken from "./PoolToken"
import * as S from "./styled"
import { useUnsupportedTokens } from "hooks/useToken"

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : "ETHER"
}

interface Props {
  currencies: Token[]
  query: string
  poolAddress?: string
  onSelect: (token: Currency) => void
  handleChange: (v: string) => void
}

interface TokenRowProps {
  data: Array<Currency>
  index: number
  style: CSSProperties
}

const TokensList: React.FC<Props> = ({
  poolAddress,
  currencies,
  query,
  onSelect,
  handleChange,
}) => {
  const itemData: Currency[] = useMemo(() => {
    // if (otherListTokens && otherListTokens?.length > 0) {
    //   return [...currencies, BREAK_LINE, ...otherListTokens]
    // }
    return currencies
  }, [currencies])

  const itemKey = useCallback(
    (index: number, data: typeof itemData) => {
      const currency = data[index]
      // if (isBreakLine(currency)) return BREAK_LINE

      return currencyKey(currency)
    },
    [itemData]
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

      if (poolAddress) {
        return (
          <PoolToken
            poolAddress={poolAddress}
            address={address}
            style={style}
            onClick={onSelect}
            currency={token}
          />
        )
      }

      return (
        <CurrencyRow
          address={address}
          style={style}
          onClick={onSelect}
          currency={token}
        />
      )
    },
    [onSelect, poolAddress, blacklistTokensAdresses]
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

  const noItems = <S.Placeholder>No results found.</S.Placeholder>

  return (
    <S.Card>
      <S.CardHeader>
        <Search
          placeholder="Name, ticker, address"
          value={query}
          handleChange={handleChange}
          height="38px"
        />
      </S.CardHeader>
      <S.CardList>{!!itemData.length ? list : noItems}</S.CardList>
    </S.Card>
  )
}

export default TokensList
