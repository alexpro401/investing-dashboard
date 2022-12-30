import { v4 as uuidv4 } from "uuid"
import { FC, HTMLAttributes, useMemo } from "react"
import { useGovPoolProposal } from "hooks/dao"
import { useInsuranceAccidentTotals } from "hooks/useInsurance"
import { Flex } from "theme"
import { normalizeBigNumber } from "utils"
import Tooltip from "components/Tooltip"
import * as S from "../../styled"
import { InsuranceAccidentMembersTable } from "common"
import { isEmpty, isNil } from "lodash"
import { BigNumber } from "@ethersproject/bignumber"
import { useBreakpoints } from "hooks"
import { useWeb3React } from "@web3-react/core"
import { ZERO } from "consts/index"
import { divideBignumbers } from "utils/formulas"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const GovPoolProposalInsurance: FC<Props> = ({ govPoolProposal }) => {
  const { account } = useWeb3React()
  const { insuranceProposalView } = govPoolProposal

  const {
    insuranceTreasuryDEXE,
    insuranceTreasuryUSD,
    totalLossDEXE,
    totalLossUSD,
    totalCoverageDEXE,
    totalCoverageUSD,
  } = useInsuranceAccidentTotals(insuranceProposalView?.investorsTotals)

  const totals = useMemo(
    () => ({
      ...insuranceProposalView?.investorsTotals,
      coverage:
        "DEXE " +
        normalizeBigNumber(
          BigNumber.from(insuranceProposalView?.investorsTotals?.coverage ?? 0),
          18,
          2
        ),
      loss:
        "$ " +
        normalizeBigNumber(
          BigNumber.from(insuranceProposalView?.investorsTotals?.loss ?? 0),
          18,
          2
        ),
      lp:
        "LP " +
        normalizeBigNumber(
          BigNumber.from(insuranceProposalView?.investorsTotals?.lp ?? 0),
          18,
          2
        ),
    }),
    [insuranceProposalView]
  )

  const youLoss = useMemo(() => {
    if (
      isNil(account) ||
      isNil(insuranceProposalView) ||
      isEmpty(insuranceProposalView?.investorsInfo) ||
      isNil(
        insuranceProposalView?.investorsInfo[
          String(account).toLocaleLowerCase()
        ]
      )
    ) {
      return { dexe: ZERO, usd: ZERO }
    }

    const {
      stakeUSD,
      poolPositionBeforeAccident,
      poolPositionOnAccidentCreation,
    } =
      insuranceProposalView?.investorsInfo[String(account).toLocaleLowerCase()]

    const { totalLPInvestVolume, totalLPDivestVolume } =
      poolPositionOnAccidentCreation

    const inDayLpAmount =
      BigNumber.from(poolPositionBeforeAccident.lpHistory[0].currentLpAmount) ??
      ZERO

    const currentLPAmount = divideBignumbers(
      [BigNumber.from(totalLPInvestVolume), 18],
      [BigNumber.from(totalLPDivestVolume), 18]
    )

    const big = divideBignumbers([inDayLpAmount, 18], [currentLPAmount, 18])

    return { dexe: big, usd: stakeUSD }
  }, [insuranceProposalView, account])

  const currentUserCoverage = useMemo(() => {
    if (
      isNil(account) ||
      isEmpty(insuranceProposalView?.investorsInfo) ||
      isNil(insuranceProposalView?.investorsInfo[account])
    ) {
      return { dexe: ZERO, usd: ZERO }
    }

    const { stake, stakeUSD } = insuranceProposalView?.investorsInfo[account]

    return { dexe: stake, usd: stakeUSD }
  }, [insuranceProposalView, account])

  const { isMobile } = useBreakpoints()

  return isNil(insuranceProposalView) ? (
    <></>
  ) : (
    <>
      <S.DaoProposalDetailsCard>
        <S.DaoProposalDetailsCardTitle>
          Головна інфа про страховий випадок
        </S.DaoProposalDetailsCardTitle>

        {!isMobile && (
          <>
            <S.DaoProposalDetailsRow>
              <Flex gap={"6"}>
                <Tooltip id={uuidv4()}>Your loss explain</Tooltip>

                <S.DaoProposalDetailsRowText textType="label">
                  Your loss
                </S.DaoProposalDetailsRowText>
              </Flex>
              <S.DaoProposalDetailsRowText textType="value">
                <S.DaoProposalDetailsRowText textType="value">
                  {normalizeBigNumber(youLoss.dexe, 18, 3)}
                </S.DaoProposalDetailsRowText>
                &nbsp;
                <S.DaoProposalDetailsRowText textType="label">
                  $ {normalizeBigNumber(youLoss.usd, 18, 2)}
                </S.DaoProposalDetailsRowText>
              </S.DaoProposalDetailsRowText>
            </S.DaoProposalDetailsRow>

            <S.DaoProposalDetailsRow>
              <Flex gap={"6"}>
                <Tooltip id={uuidv4()}>Your insurance coverage explain</Tooltip>

                <S.DaoProposalDetailsRowText textType="label">
                  Your insurance coverage
                </S.DaoProposalDetailsRowText>
              </Flex>
              <S.DaoProposalDetailsRowText textType="value">
                <S.DaoProposalDetailsRowText textType="value">
                  {normalizeBigNumber(currentUserCoverage.dexe, 18, 3)}
                </S.DaoProposalDetailsRowText>
                &nbsp;
                <S.DaoProposalDetailsRowText textType="label">
                  $ {normalizeBigNumber(currentUserCoverage.usd, 18, 3)}
                </S.DaoProposalDetailsRowText>
              </S.DaoProposalDetailsRowText>
            </S.DaoProposalDetailsRow>
          </>
        )}

        <S.DaoProposalDetailsRow>
          <Flex gap={"6"}>
            <Tooltip id={uuidv4()}>Total loss explain</Tooltip>

            <S.DaoProposalDetailsRowText textType="label">
              Total loss
            </S.DaoProposalDetailsRowText>
          </Flex>
          <S.DaoProposalDetailsRowText textType="value">
            <S.DaoProposalDetailsRowText textType="value">
              {normalizeBigNumber(totalLossDEXE, 18, 3)} {isMobile && " DEXE"}
            </S.DaoProposalDetailsRowText>
            &nbsp;
            <S.DaoProposalDetailsRowText textType="label">
              {isMobile && "("}$ {normalizeBigNumber(totalLossUSD, 18, 3)}
              {isMobile && ")"}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>

        <S.DaoProposalDetailsRow>
          <Flex gap={"6"}>
            <Tooltip id={uuidv4()}>Insurance coverage explain</Tooltip>

            <S.DaoProposalDetailsRowText textType="label">
              Insurance coverage
            </S.DaoProposalDetailsRowText>
          </Flex>
          <S.DaoProposalDetailsRowText textType="value">
            <S.DaoProposalDetailsRowText textType="value">
              {normalizeBigNumber(totalCoverageDEXE, 18, 3)}{" "}
              {isMobile && " DEXE"}
            </S.DaoProposalDetailsRowText>
            &nbsp;
            <S.DaoProposalDetailsRowText textType="label">
              {isMobile && "("}$ {normalizeBigNumber(totalCoverageUSD, 18, 3)}
              {isMobile && ")"}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>

        <S.DaoProposalDetailsRow>
          <Flex gap={"6"}>
            <Tooltip id={uuidv4()}>Insurance treasury/3 explain</Tooltip>

            <S.DaoProposalDetailsRowText textType="label">
              Insurance treasury/3
            </S.DaoProposalDetailsRowText>
          </Flex>
          <S.DaoProposalDetailsRowText textType="value">
            <S.DaoProposalDetailsRowText textType="value">
              {normalizeBigNumber(insuranceTreasuryDEXE, 18, 3)}{" "}
              {isMobile && " DEXE"}
            </S.DaoProposalDetailsRowText>
            &nbsp;
            <S.DaoProposalDetailsRowText textType="label">
              {isMobile && "("}${" "}
              {normalizeBigNumber(insuranceTreasuryUSD, 18, 3)}
              {isMobile && ")"}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>
      </S.DaoProposalDetailsCard>
      <S.DaoProposalInsuranceMembersTableWrp>
        <InsuranceAccidentMembersTable
          totals={totals}
          data={insuranceProposalView.investorsInfo}
          loading={!insuranceProposalView}
          noData={isEmpty(insuranceProposalView.investorsInfo)}
        />
      </S.DaoProposalInsuranceMembersTableWrp>
    </>
  )
}

export default GovPoolProposalInsurance
