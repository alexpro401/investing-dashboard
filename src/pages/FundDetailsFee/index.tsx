import { FC, useCallback } from "react"
import { useParams } from "react-router-dom"

import { useERC20Data } from "state/erc20/hooks"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"

import { Center, Flex } from "theme"
import Icon from "components/Icon"
import Amount from "components/Amount"
import { AppButton } from "common"
import Switch from "components/Switch"
import Tooltip from "components/Tooltip"
import Accordion from "components/Accordion"
import AmountRow from "components/Amount/Row"
import PoolPnlChart from "components/PoolPnlChart"
import WithdrawalsHistory from "components/WithdrawalsHistory"

import useFundFee from "./useFundFee"

import S, { PageLoading } from "./styled"
import { useUserAgreement } from "state/user/hooks"
import { GuardSpinner } from "react-spinners-kit"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"

const FundDetailsFee: FC = () => {
  const { poolAddress } = useParams()
  const [
    [poolData, poolInfo],
    {
      optimizeWithdrawal,

      fundCommissionPercentage,
      unlockDate,

      totalFundCommissionFeeBase,
      totalFundCommissionFeeUSD,

      fundsUnderManagementDexe,

      fundProfitWithoutTraderUSD,
      fundProfitWithoutTraderDEXE,
      fundProfitWithoutTraderPercentage,

      platformCommissionUSD,
      platformCommissionBase,
      platformCommissionPercentage,

      traderCommissionUSD,
      traderCommissionBase,

      netInvestorsProfitUSD,
      netInvestorsProfitDEXE,
      netInvestorsProfitPercentage,
    },
    { setOptimizeWithdrawal, withdrawCommission },
  ] = useFundFee(poolAddress)

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const onSubmit = useCallback(() => {
    agreed ? withdrawCommission() : setShowAgreement(true)
  }, [agreed, withdrawCommission, setShowAgreement])

  const [baseToken] = useERC20Data(poolData?.baseToken)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  if (!poolData || !poolInfo || !poolMetadata) {
    return <PageLoading />
  }

  return (
    <>
      <WithPoolAddressValidation
        poolAddress={poolAddress ?? ""}
        loader={
          <Center>
            <GuardSpinner size={20} loading />
          </Center>
        }
      >
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
                  {totalFundCommissionFeeBase} {baseToken?.symbol}
                </S.MainCardDescription>
              </S.MainCardHeaderRight>
            </Flex>

            <PoolPnlChart
              address={poolAddress}
              baseToken={poolData?.baseToken}
            />

            <Flex full dir="column" m={"16px 0 0"}>
              <AmountRow
                title="Funds under management"
                value={fundsUnderManagementDexe}
                symbol="DEXE"
              />
              <Accordion
                title="Fund Profit (Without your funds)"
                value={fundProfitWithoutTraderUSD.format}
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
                    value={platformCommissionBase}
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

            <S.OptimizeWithdrawal>
              <Flex ai="center" jc="flex-start">
                <Tooltip id="optimize-withdrawal-info">
                  Get funds only from those investors <br /> whose commission
                  covers transaction costs.
                </Tooltip>
                <S.OptimizeWithdrawalTitle>
                  Optimization commission withdrawal
                </S.OptimizeWithdrawalTitle>
              </Flex>
              <Switch
                isOn={optimizeWithdrawal}
                name="optimize-withdrawal"
                onChange={(n, s) => setOptimizeWithdrawal(s)}
              />
            </S.OptimizeWithdrawal>

            <Flex full m="24px 0 0">
              <AppButton
                onClick={onSubmit}
                full
                size="large"
                color="primary"
                text="Request Performance Fee"
              />
            </Flex>
          </S.MainCard>

          {poolAddress && (
            <Flex dir="column" full m="40px 0 0">
              <WithdrawalsHistory
                unlockDate={unlockDate}
                poolAddress={poolAddress}
              />
            </Flex>
          )}
        </S.Container>
      </WithPoolAddressValidation>
    </>
  )
}

export default FundDetailsFee
