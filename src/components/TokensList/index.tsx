import { BigNumber } from "@ethersproject/bignumber"

import { Token as IToken } from "interfaces"

import Search from "components/Search"
import { Card, CardHeader, CardList } from "./styled"
import Token from "./Token"
import { ZERO } from "constants/index"

interface Props {
  tokens: IToken[]
  query: string
  balances?: { [address: string]: BigNumber }
  onSelect: (token: IToken) => void
  handleChange: (v: string) => void
}

const TokensList: React.FC<Props> = ({
  tokens,
  query,
  balances,
  onSelect,
  handleChange,
}) => {
  const withBalance = balances === undefined || !Object.keys(balances).length

  const sortedTokens = [...tokens].sort((a, b) => {
    if (balances === undefined) return 0

    if (b.address in balances) return 1

    return -1
  })

  const getBalance = (address: string) => {
    if (withBalance) return ZERO

    if (address in balances) {
      return balances[address]
    }

    return ZERO
  }

  return (
    <Card>
      <CardHeader>
        <Search
          placeholder="Name, ticker, address"
          value={query}
          handleChange={handleChange}
          height="38px"
        />
      </CardHeader>
      <CardList>
        {sortedTokens.map((token) => {
          return (
            <Token
              balance={getBalance(token.address)}
              onClick={onSelect}
              key={token.address}
              tokenData={token}
            />
          )
        })}
      </CardList>
    </Card>
  )
}

export default TokensList
