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
import * as S from "./styled"
import { generatePath, useParams } from "react-router-dom"
import { ROUTE_PATHS } from "consts"
import { isAddress } from "utils"

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : "ETHER"
}

interface Props {
  whitelistOnly?: boolean
  currencies: Token[]
  balances: { [tokenAddress: string]: CurrencyAmount<Token> | undefined }
  prices: { [tokenAddress: string]: CurrencyAmount<Token> | undefined }
  onSelect: (token: Currency, isRisky: boolean) => void
}

interface TokenRowProps {
  data: Array<Currency>
  index: number
  style: CSSProperties
}

const TokensList: React.FC<Props> = ({
  whitelistOnly,
  currencies,
  balances,
  prices,
  onSelect,
}) => {
  const [showAlert] = useAlert()
  const userAddedTokens = useUserTokens()
  const { poolToken } = useParams()

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

  const onNotWhitelistSelect = useCallback(
    (currency: Currency) => {
      showAlert({
        type: AlertType.warning,
        content: (
          <Text
            color={theme.textColors.primary}
          >{`Whitelist only tokens supported for this type of action. ${currency.symbol} is not in the whitelist`}</Text>
        ),
        hideDuration: 7000,
      })
    },
    [showAlert]
  )

  const whitelist = useWhitelistTokens()
  const blacklist = useUnsupportedTokens()

  const handleSelect = useCallback(
    (token: Currency, isRisky?: boolean) => {
      if (whitelistOnly && isRisky) {
        onNotWhitelistSelect(token)
      } else {
        onSelect(token, !!isRisky)
      }
    },
    [onNotWhitelistSelect, onSelect, whitelistOnly]
  )

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
          price={prices[address]}
          whitelistOnly={whitelistOnly}
          balance={balances[address]}
          isRisky={!isWhitelisted}
          isUserAdded={isUserAdded}
          address={address}
          style={style}
          onClick={handleSelect}
          currency={token}
        />
      )
    },
    [
      blacklist,
      whitelist,
      userAddedTokens,
      prices,
      whitelistOnly,
      balances,
      handleSelect,
      onBlacklistSelect,
    ]
  )

  /* 
      visible when only one Risky token is in the list
      strongly hardcoded for ux purposes
      maybe should be used in parent components,
      but it's depends on hooks used here (to check if token is risky)
  */
  const RiskProposalFaqLink = useMemo(() => {
    if (isAddress(poolToken) && isAddress(itemData[0].wrapped.address))
      return (
        itemData.length === 1 &&
        !(itemData[0].wrapped.address in whitelist) && (
          <S.FloatingTextLink
            to={generatePath(ROUTE_PATHS.riskyProposalCreate, {
              tokenAddress: itemData[0].wrapped.address,
              poolAddress: poolToken || "",
              "*": "faq",
            })}
          >
            Read more about how a risky proposal works
          </S.FloatingTextLink>
        )
      )

    return null
  }, [itemData, whitelist, poolToken])

  return (
    <>
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
      {RiskProposalFaqLink}
    </>
  )
}

export default TokensList
