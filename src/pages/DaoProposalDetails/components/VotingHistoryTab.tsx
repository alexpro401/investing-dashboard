import { FC, HTMLAttributes, useMemo, useState } from "react"
import * as S from "../styled"
import ExternalLink from "components/ExternalLink"
import { shortenAddress } from "utils"
import { ICON_NAMES } from "constants/icon-names"
import { useGovPoolProposal, useGovPoolProposalVotingHistory } from "hooks/dao"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const VotingHistoryTab: FC<Props> = ({ govPoolProposal }) => {
  const [offset, setOffset] = useState(0)
  const limit = useMemo(() => 15, [])

  const { historyList, isLoading, error } = useGovPoolProposalVotingHistory(
    govPoolProposal.govPoolAddress,
    govPoolProposal.proposalId,
    offset,
    limit
  )

  return (
    <>
      <S.DaoProposalDetailsCard>
        <S.DaoProposalDetailsTxRow>
          <S.DaoProposalDetailsRowText textType="label">
            Address
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="label">
            Votes
          </S.DaoProposalDetailsRowText>
          <S.DaoProposalDetailsRowText textType="label" alignment="right">
            Date
          </S.DaoProposalDetailsRowText>
        </S.DaoProposalDetailsTxRow>
        <S.DaoProposalCardRowDivider />
        {isLoading! &&
          historyList?.length &&
          historyList.map((el) => (
            <>
              <S.DaoProposalDetailsTxRow>
                <S.DaoProposalDetailsRowText textType="label">
                  <ExternalLink href={"#"}>
                    {shortenAddress("0x000000000000000000000")}
                  </ExternalLink>
                </S.DaoProposalDetailsRowText>
                <S.DaoProposalDetailsRowText textType="value">
                  100,000
                </S.DaoProposalDetailsRowText>
                <S.DaoProposalDetailsRowText textType="label" alignment="right">
                  Jun 10, 2022, 14:29
                </S.DaoProposalDetailsRowText>
              </S.DaoProposalDetailsTxRow>
              <S.DaoProposalCardRowDivider />
            </>
          ))}
        <S.DaoProposalDetailsHistoryPaginationWrp>
          <S.DaoProposalDetailsHistoryPaginationIndicator>
            1 - 10 of 1111
          </S.DaoProposalDetailsHistoryPaginationIndicator>
          <S.DaoProposalDetailsHistoryPaginationBtn
            iconRight={ICON_NAMES.angleLeft}
            disabled={true}
          />
          <S.DaoProposalDetailsHistoryPaginationBtn
            iconRight={ICON_NAMES.angleRight}
          />
        </S.DaoProposalDetailsHistoryPaginationWrp>
      </S.DaoProposalDetailsCard>
    </>
  )
}

export default VotingHistoryTab
