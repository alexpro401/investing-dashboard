import { isNil } from "lodash"
import { FC, useCallback } from "react"
import { useNavigate } from "react-router-dom"

import LockedFundsChart from "components/LockedFundsChart"

import { Flex } from "theme"
import { Card } from "common"
import { Indents, Label, Value, AppButtonFull, ProgressBar } from "../styled"
import usePoolLockedFunds from "hooks/usePoolLockedFunds"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { Token } from "interfaces"

const TabPoolLockedFunds: FC<{
  address: string
  isTrader: boolean
  poolData: IPoolQuery
  poolInfo: IPoolInfo | null
  baseToken: Token | null
  accountLPsPrice: string
}> = ({
  address,
  poolData,
  poolInfo,
  baseToken,
  isTrader,
  accountLPsPrice,
}) => {
  const navigate = useNavigate()

  const [
    {
      baseSymbol,
      totalPoolUSD,
      traderFundsUSD,
      traderFundsBase,
      investorsFundsUSD,
      investorsFundsBase,
      poolUsedInPositionsUSD,
      poolUsedToTotalPercentage,
    },
  ] = usePoolLockedFunds(poolData, poolInfo, baseToken)

  const onTerminalNavigate = useCallback(() => {
    if (isNil(address)) return
    navigate(`/pool/invest/${address}`)
  }, [address, navigate])

  return (
    <>
      <Indents side={false}>
        <Card>
          <Flex full ai="center" jc="space-between">
            <div>
              <Value.Big block color="#E4F2FF" p="0 0 4px">
                ${investorsFundsUSD}
              </Value.Big>
              <Label>Total Investors funds</Label>
            </div>
            <div>
              <Value.Big block color="#E4F2FF" p="0 0 4px" align="right">
                ${accountLPsPrice}
              </Value.Big>
              <Label align="right">My funds</Label>
            </div>
          </Flex>
          <LockedFundsChart address={address} tfPosition="bottom" />
        </Card>
        <Indents top side={false}>
          <Card>
            <Flex full ai="center" jc="space-between">
              <Label align="right">Investor funds</Label>
              <Flex ai="center" jc="flex-end">
                <Value.Medium color="#E4F2FF">
                  ${investorsFundsUSD}
                </Value.Medium>
                &nbsp;
                <Value.Medium color="#B1C7FC">
                  {investorsFundsBase} {baseSymbol}
                </Value.Medium>
              </Flex>
            </Flex>
            <Flex full ai="center" jc="space-between">
              <Label align="right">Personal funds</Label>
              <Flex ai="center" jc="flex-end">
                <Value.Medium color="#E4F2FF">${traderFundsUSD}</Value.Medium>
                &nbsp;
                <Value.Medium color="#B1C7FC">
                  {traderFundsBase} {baseSymbol}
                </Value.Medium>
              </Flex>
            </Flex>
            <Flex full ai="center" jc="space-between">
              <Label align="right">
                Fund used ({poolUsedToTotalPercentage}%)
              </Label>
              <Flex ai="center" jc="flex-end">
                <Value.Medium color="#E4F2FF">
                  ${poolUsedInPositionsUSD.format}&nbsp;/&nbsp;
                </Value.Medium>
                &nbsp;
                <Value.Medium color="#B1C7FC">
                  {totalPoolUSD.format}
                </Value.Medium>
              </Flex>
            </Flex>
            <ProgressBar w={Number(poolUsedToTotalPercentage)} />
            {isTrader && (
              <Flex full>
                <AppButtonFull
                  onClick={onTerminalNavigate}
                  text="Invest more in my fund"
                />
              </Flex>
            )}
          </Card>
        </Indents>
      </Indents>
    </>
  )
}

export default TabPoolLockedFunds
