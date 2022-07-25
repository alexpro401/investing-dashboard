import { FC } from "react"

import Button from "components/Button"
import { BodyItem } from "components/cards/proposal/styled"

interface Props {
  ticker: string
  baseTokenTicker: string

  fullness: string
  supply: string
  expirationDate: string
  yourBalance: string
  dividendsAvailable: string
  totalDividends: string
  invested: boolean
  apr: string
}

const BodyInvestor: FC<Props> = ({
  ticker,
  baseTokenTicker,
  fullness,
  supply,
  invested,
  expirationDate,
  yourBalance,
  dividendsAvailable,
  totalDividends,
  apr,
}) => {
  return (
    <>
      {invested ? (
        <>
          <BodyItem label={`Supply (${ticker})`} amount={supply} />
          <BodyItem label="Fulness" amount={`${fullness}%`} />
          <BodyItem
            label={"Your balance " + baseTokenTicker}
            amount={yourBalance}
            ai="flex-end"
          />
          <BodyItem label="APR" amount={`${apr} %`} />
          <BodyItem
            label="Total dividends ($)"
            amount={`~${dividendsAvailable}`}
          />
          <BodyItem
            label="Dividends avail. ($)"
            amount={`~${totalDividends}`}
            ai="flex-end"
          />
          <BodyItem label="Custodian" amount={"-"} />
          <BodyItem label="Price OTC" amount={"-"} />
          <BodyItem
            label="Expiration date"
            amount={expirationDate}
            fz="11px"
            ai="flex-end"
          />
        </>
      ) : (
        <>
          <BodyItem label={"Proposal size " + ticker} amount={totalDividends} />
          <BodyItem label="Fulness" amount={`${fullness}%`} />
          <BodyItem
            label="Expiration date"
            amount={expirationDate}
            fz="11px"
            ai="flex-end"
          />
          <BodyItem label="Custodian" amount={"-"} />
          <BodyItem label="LP price ($)" amount={"999,989"} />
          <div>
            <Button
              full
              size="small"
              br="10px"
              onClick={(e) => {
                e?.stopPropagation()
                console.log("Stake LP")
              }}
            >
              Stake LP
            </Button>
          </div>
        </>
      )}
    </>
  )
}

export default BodyInvestor
