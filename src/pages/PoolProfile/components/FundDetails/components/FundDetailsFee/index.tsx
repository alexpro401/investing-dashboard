import { FC, useCallback, useContext } from "react"

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

import S, { PageLoading } from "./styled"
import { useUserAgreement } from "state/user/hooks"
import { GuardSpinner } from "react-spinners-kit"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { useBreakpoints } from "hooks"
import { FundDetailsWithdrawalHistory } from "pages/PoolProfile/components/FundDetails"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { Bus } from "helpers"

const FundDetailsFee: FC = () => {
  const { perfomanceFee, fundAddress, fundTicker, fundName, basicToken } =
    useContext(PoolProfileContext)

  const { isSmallTablet } = useBreakpoints()

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const onSubmit = useCallback(() => {
    agreed ? perfomanceFee?.withdrawCommission() : setShowAgreement(true)
  }, [agreed, perfomanceFee, setShowAgreement])

  const [baseToken] = useERC20Data(perfomanceFee?.perfomancePoolData?.baseToken)

  const [{ poolMetadata }] = usePoolMetadata(
    fundAddress,
    perfomanceFee?.perfomancePpoolInfo?.parameters.descriptionURL
  )

  return (
    <S.Container>
      {isSmallTablet ? (
        <></>
      ) : (
        <S.FeeDateCard>
          <S.FeeDateText>
            Performance Fee {perfomanceFee?.fundCommissionPercentage.format}%
            are available from {perfomanceFee?.unlockDate}
          </S.FeeDateText>
        </S.FeeDateCard>
      )}

      <S.MainCard>
        <Flex dir="row" full>
          <Flex dir="row">
            <Icon
              size={38}
              m="0 8px 0 0"
              source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
              address={fundAddress}
            />
            <div>
              <S.MainCardTitle>{fundTicker}</S.MainCardTitle>
              <S.MainCardDescription m="2px 0 0">
                {fundName}
              </S.MainCardDescription>
            </div>
          </Flex>
          <S.MainCardHeaderRight>
            <S.MainCardTitle>
              ${perfomanceFee?.totalFundCommissionFeeUSD}
            </S.MainCardTitle>
            <S.MainCardDescription m="2px 0 0">
              {perfomanceFee?.totalFundCommissionFeeBase} {baseToken?.symbol}
            </S.MainCardDescription>
          </S.MainCardHeaderRight>
        </Flex>

        <PoolPnlChart address={fundAddress} baseToken={basicToken?.address} />

        <Flex full dir="column" m={"16px 0 0"}>
          <AmountRow
            title="Funds under management"
            value={perfomanceFee?.fundsUnderManagementDexe}
            symbol="DEXE"
          />
          <Accordion
            title="Fund Profit (Without your funds)"
            value={perfomanceFee?.fundProfitWithoutTraderUSD.format}
            symbol="USD"
            m="8px 0 0"
          >
            <Flex full dir="column" ai="flex-end">
              <Amount
                value={perfomanceFee?.fundProfitWithoutTraderDEXE}
                symbol={"DEXE"}
              />
              <Amount
                value={`${perfomanceFee?.fundProfitWithoutTraderPercentage}%`}
                m="4px 0 0"
              />
            </Flex>
          </Accordion>
          <Accordion
            title="Platform Fee"
            value={perfomanceFee?.platformCommissionUSD}
            symbol="USD"
            m="8px 0 0"
          >
            <Flex full dir="column" ai="flex-end">
              <Amount
                value={perfomanceFee?.platformCommissionBase}
                symbol={baseToken?.symbol}
              />
              <Amount
                value={`${perfomanceFee?.platformCommissionPercentage} %`}
                m="4px 0 0"
              />
            </Flex>
          </Accordion>
          <Accordion
            title="Perfomance Fee"
            value={perfomanceFee?.traderCommissionUSD}
            symbol="USD"
            m="8px 0 0"
          >
            <Flex full dir="column" ai="flex-end">
              <Amount
                value={perfomanceFee?.traderCommissionBase}
                symbol={baseToken?.symbol}
              />
              <Amount
                value={`${perfomanceFee?.fundCommissionPercentage.format} %`}
                m="4px 0 0"
              />
            </Flex>
          </Accordion>

          <Accordion
            title="Net Investor Profit"
            value={perfomanceFee?.netInvestorsProfitUSD.format}
            symbol="USD"
            m="8px 0 0"
          >
            <Flex full dir="column" ai="flex-end">
              <Amount
                value={perfomanceFee?.netInvestorsProfitDEXE}
                symbol={"DEXE"}
              />
              <Amount
                value={`${perfomanceFee?.netInvestorsProfitPercentage} %`}
                m="4px 0 0"
              />
            </Flex>
          </Accordion>
        </Flex>

        <S.OptimizeWithdrawal>
          <Flex ai="center" jc="flex-start">
            <Tooltip id="optimize-withdrawal-info">
              Get funds only from those investors <br /> whose commission covers
              transaction costs.
            </Tooltip>
            <S.OptimizeWithdrawalTitle>
              Optimization commission withdrawal
            </S.OptimizeWithdrawalTitle>
          </Flex>
          <Switch
            isOn={perfomanceFee?.optimizeWithdrawal}
            name="optimize-withdrawal"
            onChange={(n, s) => perfomanceFee?.setOptimizeWithdrawal(s)}
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

      {isSmallTablet ? (
        <S.WithdrawalHistoryBtn
          type="button"
          onClick={() => Bus.emit("manage-modal/withdrawal-history")}
        >
          Withdrawal history
        </S.WithdrawalHistoryBtn>
      ) : (
        <>
          <S.WithdrawalHistoryTitle>
            Withdrawal history
          </S.WithdrawalHistoryTitle>
          <FundDetailsWithdrawalHistory />
        </>
      )}
    </S.Container>
  )
}

export default FundDetailsFee
