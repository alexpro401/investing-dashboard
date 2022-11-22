import { FC } from "react"

import { AppButton } from "common"
import { BodyItem } from "components/cards/proposal/styled"
import { BigNumber } from "@ethersproject/bignumber"

interface Props {
  ticker: string
  baseTokenTicker: string

  fullness: string
  supply: { big: BigNumber; format: string }
  expirationDate: string
  yourBalance: string
  dividendsAvailable: string
  totalDividends: string
  invested: boolean
  apr: string
  poolPriceUSD: string

  onInvest: () => void
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
  poolPriceUSD,
  onInvest,
}) => {
  return (
    <>
      {invested ? (
        <>
          <BodyItem label={`Supply (${ticker})`} amount={supply.format} />
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
          <BodyItem label="LP price ($)" amount={poolPriceUSD} />
          <div>
            <AppButton
              full
              onClick={(e) => {
                e?.stopPropagation()
                onInvest()
              }}
              size="x-small"
              text="Stake LP"
            />
          </div>
        </>
      )}
    </>
  )
}

export default BodyInvestor
