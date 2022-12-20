import { v4 as uuidv4 } from "uuid"
import { FC, HTMLAttributes } from "react"
import { useGovPoolProposal } from "hooks/dao"
import { useInsuranceAccidentTotals } from "hooks/useInsurance"
import { Flex } from "theme"
import { normalizeBigNumber } from "utils"
import Tooltip from "components/Tooltip"
import * as S from "../../styled"
import { InsuranceAccidentMembersTable } from "common"
import { isEmpty, isNil } from "lodash"
import { BigNumber } from "@ethersproject/bignumber"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const GovPoolProposalInsurance: FC<Props> = ({ govPoolProposal }) => {
  const { insuranceProposalView } = govPoolProposal

  const {
    insuranceTreasuryDEXE,
    insuranceTreasuryUSD,
    totalLossDEXE,
    totalLossUSD,
    totalCoverageDEXE,
    totalCoverageUSD,
  } = useInsuranceAccidentTotals(insuranceProposalView?.investorsTotals)

  return isNil(insuranceProposalView) ? (
    <></>
  ) : (
    <>
      <S.DaoProposalDetailsCard>
        <S.DaoProposalDetailsCardTitle>
          Головна інфа про страховий випадок
        </S.DaoProposalDetailsCardTitle>

        <S.DaoProposalDetailsRow>
          <Flex gap={"6"}>
            <Tooltip id={uuidv4()}>Total loss explain</Tooltip>

            <S.DaoProposalDetailsRowText textType="label">
              Total loss
            </S.DaoProposalDetailsRowText>
          </Flex>
          <S.DaoProposalDetailsRowText textType="value">
            <S.DaoProposalDetailsRowText textType="value">
              {normalizeBigNumber(totalLossDEXE, 18, 3)} DEXE
            </S.DaoProposalDetailsRowText>
            &nbsp;
            <S.DaoProposalDetailsRowText textType="label">
              ($ {normalizeBigNumber(totalLossUSD, 18, 3)})
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
              {normalizeBigNumber(totalCoverageDEXE, 18, 3)} DEXE
            </S.DaoProposalDetailsRowText>
            &nbsp;
            <S.DaoProposalDetailsRowText textType="label">
              ($ {normalizeBigNumber(totalCoverageUSD, 18, 3)})
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
              {normalizeBigNumber(insuranceTreasuryDEXE, 18, 3)} DEXE
            </S.DaoProposalDetailsRowText>
            &nbsp;
            <S.DaoProposalDetailsRowText textType="label">
              ($ {normalizeBigNumber(insuranceTreasuryUSD, 18, 3)})
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsRow>
      </S.DaoProposalDetailsCard>
      <InsuranceAccidentMembersTable
        totals={{
          ...insuranceProposalView?.investorsTotals,
          coverage:
            "DEXE " +
            normalizeBigNumber(
              BigNumber.from(
                insuranceProposalView?.investorsTotals?.coverage ?? 0
              ),
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
        }}
        data={insuranceProposalView.investorsInfo}
        loading={!insuranceProposalView}
        noData={isEmpty(insuranceProposalView.investorsInfo)}
      />
    </>
  )
}

export default GovPoolProposalInsurance
