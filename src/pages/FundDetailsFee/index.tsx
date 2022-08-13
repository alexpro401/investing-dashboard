import { FC, useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"
import { useWeb3React } from "@web3-react/core"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"
import { useSelector } from "react-redux"
import { format } from "date-fns"

import { PriceFeed } from "abi"
import useCoreProperties from "hooks/useCoreProperties"
import { expandTimestamp, formatBigNumber } from "utils"
import useContract, { useERC20 } from "hooks/useContract"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import useWithdrawalHistory from "hooks/useWithdrawalHistory"
import { selectPriceFeedAddress } from "state/contracts/selectors"
import { usePoolContract, usePoolQuery, useTraderPool } from "hooks/usePool"

import { Flex } from "theme"
import Icon from "components/Icon"
import Amount from "components/Amount"
import Button from "components/Button"
import FeeChart from "components/FeeChart"
import Accordion from "components/Accordion"
import AmountRow from "components/Amount/Row"
import WithdrawalHistory from "./WithdrawalHistory"

import S, { PageLoading } from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

interface IAmount {
  big: BigNumber
  format: string
}

const defaultAmountState: IAmount = {
  big: BigNumber.from("0"),
  format: formatBigNumber(BigNumber.from("0"), 18, 6),
}

const FundDetailsFee: FC = () => {
  const { poolAddress } = useParams()
  const { account } = useWeb3React()

  const [poolData] = usePoolQuery(poolAddress)
  const [, poolInfoData] = usePoolContract(poolAddress)
  const [, baseToken] = useERC20(poolData?.baseToken)
  const traderPool = useTraderPool(poolData?.id)

  const priceFeedAddress = useSelector(selectPriceFeedAddress)
  const priceFeed = useContract(priceFeedAddress, PriceFeed)
  const coreProperties = useCoreProperties()

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfoData?.parameters.descriptionURL
  )

  const [traderDexeManagementAmount, setTraderDexeManagementAmount] =
    useState<IAmount>(defaultAmountState)
  const [traderUSDCommission, setTraderUSDCommission] =
    useState<IAmount>(defaultAmountState)
  const [traderBaseCommission, setTraderBaseCommission] =
    useState<IAmount>(defaultAmountState)

  const [platformLPCommission, setPlatformLPCommission] =
    useState<IAmount>(defaultAmountState)
  const [platformUSDCommission, setPlatformUSDCommission] =
    useState<IAmount>(defaultAmountState)
  const [platformPercentageCommission, setPlatformPercentageCommission] =
    useState<IAmount>(defaultAmountState)

  const [netInvestorProfitDEXE, setNetInvestorProfitDEXE] =
    useState<IAmount>(defaultAmountState)

  const [unlockTimestamp, setUnlockTimestamp] = useState<BigNumber>(
    BigNumber.from("0")
  )

  const withdrawalHistory = useWithdrawalHistory()

  /**
   * Next commission epoch start date
   */
  const unlockDate = useMemo<string>(() => {
    if (!unlockTimestamp || unlockTimestamp.isZero()) return ""

    const expanded = expandTimestamp(Number(unlockTimestamp.toString()))
    return format(expanded, "MMM dd, y")
  }, [unlockTimestamp])

  /**
   * Total funds under pool management in USD
   */
  const totalPoolUSD = useMemo<IAmount>(() => {
    if (!poolInfoData) return defaultAmountState

    return {
      big: poolInfoData.totalPoolUSD,
      format: formatBigNumber(poolInfoData.totalPoolUSD, 18, 2),
    }
  }, [poolInfoData])

  /**
   * Total funds under pool management in baseToken
   */
  const totalPoolBase = useMemo<string>(() => {
    if (!poolInfoData) return "0"

    return formatBigNumber(poolInfoData.totalPoolBase)
  }, [poolInfoData])

  /**
   * Funds under pool management in baseToken (without trader funds)
   */
  const fundsUnderManagementBase = useMemo<BigNumber>(() => {
    if (!poolInfoData) return BigNumber.from("0")

    const { totalPoolBase, traderBase } = poolInfoData

    const result = FixedNumber.fromValue(totalPoolBase, 18).subUnsafe(
      FixedNumber.fromValue(traderBase, 18)
    )

    return BigNumber.from(result)
  }, [poolInfoData])

  /**
   * Pool commission percentage
   */
  const poolCommissionPercentage = useMemo<IAmount>(() => {
    if (!poolInfoData) return defaultAmountState
    const { commissionPercentage } = poolInfoData?.parameters
    return {
      big: commissionPercentage,
      format: formatBigNumber(commissionPercentage, 25, 2),
    }
  }, [poolInfoData])

  /**
   * Pool profit (without trader funds)
   * (platformUSDCommission + traderUSDCommission) / (100% - poolCommissionPercentage)
   */
  const poolProfitWithoutTraderUSD = useMemo<IAmount>(() => {
    if (
      !platformUSDCommission ||
      !traderUSDCommission ||
      !poolCommissionPercentage
    ) {
      return defaultAmountState
    }

    const commissionsSum = FixedNumber.fromValue(
      platformUSDCommission.big,
      18
    ).addUnsafe(FixedNumber.fromValue(traderUSDCommission.big, 18))

    const percent = FixedNumber.from("100").subUnsafe(
      FixedNumber.fromValue(poolCommissionPercentage.big, 18)
    )

    const big = BigNumber.from(commissionsSum.divUnsafe(percent))

    return { big, format: formatBigNumber(big, 18, 6) }
  }, [platformUSDCommission, traderUSDCommission, poolCommissionPercentage])

  /**
   * Investors profit in USD
   * fundsUnderManagementBase - (platformUSDCommission + traderUSDCommission)
   */
  const netInvestorProfitUSD = useMemo<IAmount>(() => {
    if (
      !fundsUnderManagementBase ||
      !platformUSDCommission.big ||
      !traderUSDCommission.big
    ) {
      return defaultAmountState
    }

    const platformAndTraderAmount = FixedNumber.fromValue(
      platformUSDCommission.big,
      18
    ).addUnsafe(FixedNumber.fromValue(traderUSDCommission.big, 18))

    const big = BigNumber.from(
      FixedNumber.fromValue(fundsUnderManagementBase, 18).subUnsafe(
        platformAndTraderAmount
      )
    )

    return { big, format: formatBigNumber(big, 18, 2) }
  }, [
    fundsUnderManagementBase,
    platformUSDCommission.big,
    traderUSDCommission.big,
  ])

  /**
   * Investors profit percentage
   * (netInvestorProfitUSD / (totalPoolUSD - traderUSDCommission) ) / 100
   */
  const netInvestorProfitPercentage = useMemo<IAmount>(() => {
    if (
      !netInvestorProfitUSD.big ||
      !totalPoolUSD.big ||
      !traderUSDCommission.big ||
      netInvestorProfitUSD.big.isZero() ||
      totalPoolUSD.big.isZero() ||
      traderUSDCommission.big.isZero()
    ) {
      return defaultAmountState
    }

    const investorsUSDAmount = FixedNumber.fromValue(
      totalPoolUSD.big,
      18
    ).subUnsafe(FixedNumber.fromValue(traderUSDCommission.big, 18))

    const investorsUSDSome = FixedNumber.fromValue(
      netInvestorProfitUSD.big,
      18
    ).divUnsafe(investorsUSDAmount)

    const big = BigNumber.from(
      investorsUSDSome.divUnsafe(FixedNumber.from(100))
    )

    return { big, format: formatBigNumber(big, 18, 2) }
  }, [netInvestorProfitUSD, totalPoolUSD, traderUSDCommission])

  const baseTokenSymbol = useMemo(() => {
    if (!baseToken) return ""

    return baseToken.symbol
  }, [baseToken])

  /**
   * Get the trader commission for the pool
   */
  const onPerformanceFeeRequest = () => {
    console.log("Request Performance Fee")
  }

  // Fetch platform and trader commissions
  useEffect(() => {
    if (!traderPool) return
    ;(async () => {
      try {
        const commissions = await traderPool.getReinvestCommissions([0, 1000])

        if (commissions.dexeLPCommission) {
          const { dexeLPCommission } = commissions

          const prepared: IAmount = {
            big: dexeLPCommission,
            format: formatBigNumber(dexeLPCommission, 18, 6),
          }

          setPlatformLPCommission(prepared)
        }

        if (commissions.dexeUSDCommission) {
          const { dexeUSDCommission } = commissions

          const prepared: IAmount = {
            big: dexeUSDCommission,
            format: formatBigNumber(dexeUSDCommission, 18, 2),
          }

          setPlatformUSDCommission(prepared)
        }

        if (commissions.traderBaseCommission) {
          const { traderBaseCommission } = commissions

          const prepared: IAmount = {
            big: traderBaseCommission,
            format: formatBigNumber(traderBaseCommission, 18, 2),
          }

          setTraderBaseCommission(prepared)
        }

        if (commissions.traderUSDCommission) {
          const { traderUSDCommission } = commissions

          const prepared: IAmount = {
            big: traderUSDCommission,
            format: formatBigNumber(traderUSDCommission, 18, 2),
          }

          setTraderUSDCommission(prepared)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [traderPool])

  // Fetch price of "net. Investor Profit" in DEXE
  useEffect(() => {
    if (!priceFeed) return
    if (!baseToken || !baseToken.address) return
    if (fundsUnderManagementBase.isZero()) return
    ;(async () => {
      try {
        const priceDexe = await priceFeed.getNormalizedPriceOutDEXE(
          baseToken.address,
          fundsUnderManagementBase.toString()
        )

        if (priceDexe && priceDexe.amountOut) {
          const prepared: IAmount = {
            big: priceDexe.amountOut,
            format: formatBigNumber(priceDexe.amountOut, 18, 6),
          }
          setTraderDexeManagementAmount(prepared)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [baseToken, fundsUnderManagementBase, priceFeed])

  // Fetch next commission epoch start date
  useEffect(() => {
    if (!traderPool || !account) return
    ;(async () => {
      try {
        const traderData = await traderPool.getUsersInfo(account, 0, 0)
        if (traderData && traderData[1]) {
          const { commissionUnlockTimestamp } = traderData[1]
          setUnlockTimestamp(commissionUnlockTimestamp)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [traderPool, account])

  // Fetch platform commission percentages
  useEffect(() => {
    if (!coreProperties) return
    ;(async () => {
      try {
        const platformCommissionPercentages =
          await coreProperties.getDEXECommissionPercentages()

        if (platformCommissionPercentages && platformCommissionPercentages[0]) {
          setPlatformPercentageCommission({
            big: platformCommissionPercentages[0],
            format: formatBigNumber(platformCommissionPercentages[0], 25, 2),
          })
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [coreProperties])

  // Fetch price of funds under management in DEXE
  useEffect(() => {
    if (!priceFeed) return
    ;(async () => {
      try {
        const priceDexe = await priceFeed.getNormalizedPriceOutDEXE(
          "0x8a9424745056Eb399FD19a0EC26A14316684e274",
          netInvestorProfitUSD.big.toString()
        )
        if (priceDexe && priceDexe.amountOut) {
          const prepared: IAmount = {
            big: priceDexe.amountOut,
            format: formatBigNumber(priceDexe.amountOut, 18, 6),
          }
          setNetInvestorProfitDEXE(prepared)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [netInvestorProfitUSD.big, priceFeed])

  if (!poolData || !poolInfoData || !poolMetadata) {
    return <PageLoading />
  }

  return (
    <>
      <S.Container>
        <S.FeeDateCard>
          <S.FeeDateText>
            Performance Fee {poolCommissionPercentage.format}% are available
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
                address={poolData.id}
              />
              <div>
                <S.MainCardTitle>{poolData.ticker}</S.MainCardTitle>
                <S.MainCardDescription m="2px 0 0">
                  {poolData.name}
                </S.MainCardDescription>
              </div>
            </Flex>
            <S.MainCardHeaderRight>
              <S.MainCardTitle>${totalPoolUSD.format}</S.MainCardTitle>
              <S.MainCardDescription m="2px 0 0">
                {totalPoolBase} {baseTokenSymbol}
              </S.MainCardDescription>
            </S.MainCardHeaderRight>
          </Flex>

          <FeeChart address={poolAddress} />

          <Flex full dir="column">
            <AmountRow
              title="Funds under management"
              value={traderDexeManagementAmount.format}
              symbol="DEXE"
            />
            <Accordion
              title="Fund Profit (Without your funds)"
              value={poolProfitWithoutTraderUSD.format}
              symbol="USD"
              m="8px 0 0"
            >
              <Flex full dir="column" ai="flex-end">
                <Amount value={"-"} symbol={"DEXE"} />
                <Amount value={"- %"} m="4px 0 0" />
              </Flex>
            </Accordion>
            <Accordion
              title="Platform Fee"
              value={platformUSDCommission.format}
              symbol="USD"
              m="8px 0 0"
            >
              <Flex full dir="column" ai="flex-end">
                <Amount
                  value={platformLPCommission.format}
                  symbol={baseTokenSymbol}
                />
                <Amount
                  value={`${platformPercentageCommission.format} %`}
                  m="4px 0 0"
                />
              </Flex>
            </Accordion>
            <Accordion
              title="Perfomance Fee"
              value={traderUSDCommission.format}
              symbol="USD"
              m="8px 0 0"
            >
              <Flex full dir="column" ai="flex-end">
                <Amount
                  value={traderBaseCommission.format}
                  symbol={baseTokenSymbol}
                />
                <Amount
                  value={`${poolCommissionPercentage.format} %`}
                  m="4px 0 0"
                />
              </Flex>
            </Accordion>
            <Accordion
              title="Net Investor Profit"
              value={netInvestorProfitUSD.format}
              symbol="USD"
              m="8px 0 0"
            >
              <Flex full dir="column" ai="flex-end">
                <Amount value={netInvestorProfitDEXE.format} symbol={"DEXE"} />
                <Amount
                  value={`${netInvestorProfitPercentage.format} %`}
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
          <WithdrawalHistory
            payload={withdrawalHistory}
            unlockDate={unlockDate}
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
