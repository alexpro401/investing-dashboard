import { FC, HTMLAttributes, useMemo, useState } from "react"
import * as S from "../styled"
import ExternalLink from "components/ExternalLink"
import { DateUtil, fromBig, shortenAddress } from "utils"
import { ICON_NAMES } from "constants/icon-names"
import { useGovPoolProposal, useGovPoolProposalVotingHistory } from "hooks/dao"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useActiveWeb3React } from "hooks"
import { NoDataMessage } from "common"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const VotingHistoryTab: FC<Props> = ({ govPoolProposal }) => {
  const [offset, setOffset] = useState(0)
  const limit = useMemo(() => 1, [])

  const { proposalVotes, isLoading, totalVotesCount } =
    useGovPoolProposalVotingHistory(
      offset,
      limit,
      govPoolProposal.govPoolAddress,
      String(govPoolProposal?.wrappedProposalView?.proposalId)
    )

  const { chainId } = useActiveWeb3React()

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
        {!isLoading && !!proposalVotes?.length ? (
          proposalVotes.map((el) => (
            <>
              <S.DaoProposalDetailsTxRow>
                <S.DaoProposalDetailsRowText textType="label">
                  <ExternalLink
                    href={getExplorerLink(
                      chainId!,
                      el.voterAddress,
                      ExplorerDataType.ADDRESS
                    )}
                  >
                    {shortenAddress(el.voterAddress)}
                  </ExternalLink>
                </S.DaoProposalDetailsRowText>
                <S.DaoProposalDetailsRowText textType="value">
                  {fromBig(el.personalAmount)}
                </S.DaoProposalDetailsRowText>
                <S.DaoProposalDetailsRowText textType="label" alignment="right">
                  {
                    DateUtil.fromTimestamp(
                      el.timestamp,
                      "MMM dd, y hh:mm"
                    ) as string
                  }
                </S.DaoProposalDetailsRowText>
              </S.DaoProposalDetailsTxRow>
              <S.DaoProposalCardRowDivider />
            </>
          ))
        ) : (
          <NoDataMessage />
        )}
        {totalVotesCount > limit && (
          <S.DaoProposalDetailsHistoryPaginationWrp>
            <S.DaoProposalDetailsHistoryPaginationIndicator>
              {`${offset} - ${offset + limit} of ${totalVotesCount}`}
            </S.DaoProposalDetailsHistoryPaginationIndicator>
            <S.DaoProposalDetailsHistoryPaginationBtn
              iconRight={ICON_NAMES.angleLeft}
              onClick={() => setOffset(+offset - +limit)}
              disabled={offset === 0}
            />
            <S.DaoProposalDetailsHistoryPaginationBtn
              iconRight={ICON_NAMES.angleRight}
              onClick={() => setOffset(+offset + +limit)}
              disabled={offset === totalVotesCount - 1}
            />
          </S.DaoProposalDetailsHistoryPaginationWrp>
        )}
      </S.DaoProposalDetailsCard>
    </>
  )
}

export default VotingHistoryTab
