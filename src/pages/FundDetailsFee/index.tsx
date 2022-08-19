import { FC, useCallback } from "react"
import { useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"
import { BigNumber } from "@ethersproject/bignumber"
import { useSelector } from "react-redux"

import { PriceFeed } from "abi"
import { selectPriceFeedAddress } from "state/contracts/selectors"

import useContract, { useERC20 } from "hooks/useContract"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"

import { Flex } from "theme"
import Icon from "components/Icon"
import Amount from "components/Amount"
import Button from "components/Button"
import FeeChart from "components/FeeChart"
import Accordion from "components/Accordion"
import AmountRow from "components/Amount/Row"
import WithdrawalsHistory from "components/WithdrawalsHistory"

import useFundFee from "./useFundFee"
import S, { PageLoading } from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const FundDetailsFee: FC = () => {
  const { poolAddress } = useParams()
  const [
    [poolData, poolInfo],
    {
      fundCommissionPercentage,
      unlockDate,

      totalFundCommissionFeeBase,
      totalFundCommissionFeeUSD,

      fundsUnderManagementDexe,

      fundProfitWithoutTraderUSD,
      fundProfitWithoutTraderDEXE,
      fundProfitWithoutTraderPercentage,

      platformCommissionLP,
      platformCommissionUSD,
      platformCommissionPercentage,

      traderCommissionUSD,
      traderCommissionBase,

      netInvestorsProfitUSD,
      netInvestorsProfitDEXE,
      netInvestorsProfitPercentage,
    },
  ] = useFundFee(poolAddress)

  const [, baseToken] = useERC20(poolData?.baseToken)

  const priceFeedAddress = useSelector(selectPriceFeedAddress)
  const priceFeed = useContract(priceFeedAddress, PriceFeed)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const getBaseTokensNormalizedPriceOutUSD = useCallback(
    async (amount: BigNumber) => {
      if (!priceFeed || !baseToken) return BigNumber.from("0")

      try {
        const price = await priceFeed.getNormalizedPriceOutUSD(
          baseToken.address,
          amount.toHexString()
        )
        if (price && price.amountOut) {
          return price.amountOut
        }

        return BigNumber.from("0")
      } catch (error) {
        console.error(error)
      }
    },
    [priceFeed, baseToken]
  )

  /**
   * Get the trader commission for the pool
   */
  const onPerformanceFeeRequest = () => {
    console.log("Request Performance Fee")
  }

  if (!poolData || !poolInfo || !poolMetadata) {
    return <PageLoading />
  }

  return (
    <>
      <S.Container>
        <S.FeeDateCard>
          <S.FeeDateText>
            Performance Fee {fundCommissionPercentage.format}% are available
            from {unlockDate}
          </S.FeeDateText>
        </S.FeeDateCard>

        <S.MainCard>
          <Flex dir="row" full>
            <Flex dir="row">
              <Icon
                size={38}
                m="0 8px 0 0"
                source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
                address={poolAddress}
              />
              <div>
                <S.MainCardTitle>{poolData.ticker}</S.MainCardTitle>
                <S.MainCardDescription m="2px 0 0">
                  {poolData.name}
                </S.MainCardDescription>
              </div>
            </Flex>
            <S.MainCardHeaderRight>
              <S.MainCardTitle>${totalFundCommissionFeeUSD}</S.MainCardTitle>
              <S.MainCardDescription m="2px 0 0">
                {totalFundCommissionFeeBase}
                {baseToken?.symbol}
              </S.MainCardDescription>
            </S.MainCardHeaderRight>
          </Flex>

          <FeeChart address={poolAddress} />

          <Flex full dir="column">
            <AmountRow
              title="Funds under management"
              value={fundsUnderManagementDexe}
              symbol="DEXE"
            />
            <Accordion
              title="Fund Profit (Without your funds)"
              value={fundProfitWithoutTraderUSD}
              symbol="USD"
              m="8px 0 0"
            >
              <Flex full dir="column" ai="flex-end">
                <Amount value={fundProfitWithoutTraderDEXE} symbol={"DEXE"} />
                <Amount
                  value={`${fundProfitWithoutTraderPercentage}%`}
                  m="4px 0 0"
                />
              </Flex>
            </Accordion>
            <Accordion
              title="Platform Fee"
              value={platformCommissionUSD}
              symbol="USD"
              m="8px 0 0"
            >
              <Flex full dir="column" ai="flex-end">
                <Amount
                  value={platformCommissionLP}
                  symbol={baseToken?.symbol}
                />
                <Amount
                  value={`${platformCommissionPercentage} %`}
                  m="4px 0 0"
                />
              </Flex>
            </Accordion>
            <Accordion
              title="Perfomance Fee"
              value={traderCommissionUSD}
              symbol="USD"
              m="8px 0 0"
            >
              <Flex full dir="column" ai="flex-end">
                <Amount
                  value={traderCommissionBase}
                  symbol={baseToken?.symbol}
                />
                <Amount
                  value={`${fundCommissionPercentage.format} %`}
                  m="4px 0 0"
                />
              </Flex>
            </Accordion>

            <Accordion
              title="Net Investor Profit"
              value={netInvestorsProfitUSD.format}
              symbol="USD"
              m="8px 0 0"
            >
              <Flex full dir="column" ai="flex-end">
                <Amount value={netInvestorsProfitDEXE} symbol={"DEXE"} />
                <Amount
                  value={`${netInvestorsProfitPercentage} %`}
                  m="4px 0 0"
                />
              </Flex>
            </Accordion>
          </Flex>

          <Flex full m="24px 0 0">
            <Button onClick={onPerformanceFeeRequest} full size="large">
              Request Performance Fee
            </Button>
          </Flex>
        </S.MainCard>

        <Flex dir="column" full m="40px 0 0">
          <WithdrawalsHistory
            unlockDate={unlockDate}
            getBaseInUSD={getBaseTokensNormalizedPriceOutUSD}
          />
        </Flex>
      </S.Container>
    </>
  )
}

export default function FeeWithProvider() {
  return (
    <GraphProvider value={poolsClient}>
      <FundDetailsFee />
    </GraphProvider>
  )
}
