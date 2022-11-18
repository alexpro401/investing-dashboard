import * as S from "./styled"

import { FC, HTMLAttributes } from "react"
import { ICON_NAMES } from "constants/icon-names"
import { shortenAddress } from "utils"
import { IGovPool } from "interfaces/typechain/GovPool"
import { useGovPoolProposal } from "hooks/dao"
import { useParams } from "react-router-dom"

interface Props extends HTMLAttributes<HTMLDivElement> {
  proposalId: number
  proposalView: IGovPool.ProposalViewStructOutput
}

const DaoProposalCard: FC<Props> = ({ proposalId, proposalView, ...rest }) => {
  const { daoAddress } = useParams()

  const {
    creator,
    votedAddresses,
    name,
    proposalType,
    voteEnd,
    votesFor,
    votesTotalNeed,
  } = useGovPoolProposal(proposalId, daoAddress!, proposalView)

  return (
    <S.Root {...rest}>
      <S.DaoProposalCardHead>
        <S.DaoProposalCardHeadTitleWrp>
          <S.DaoProposalCardHeadTitle>{name}</S.DaoProposalCardHeadTitle>
        </S.DaoProposalCardHeadTitleWrp>
        <S.DaoProposalCardHeadIcon name={ICON_NAMES.arrowDownFilled} />
      </S.DaoProposalCardHead>
      <S.DaoProposalCardBody>
        <S.DaoProposalCardBlockInfo>
          <S.DaoProposalCardBlockInfoAddress href={""}>
            {shortenAddress(creator)}
          </S.DaoProposalCardBlockInfoAddress>
          <S.DaoProposalCardBlockInfoLabel>
            Created by
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>
        <S.DaoProposalCardBlockInfo alignRight={true}>
          <S.DaoProposalCardBlockInfoValue>
            {votesFor}/
            <S.DaoVotingStatusCounterTotal>
              {votesTotalNeed}
            </S.DaoVotingStatusCounterTotal>
          </S.DaoProposalCardBlockInfoValue>
          <S.DaoProposalCardBlockInfoLabel>
            Voting status
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>
        <S.DaoVotingProgressBar progress={(votesTotalNeed / 100) * votesFor} />
        <S.DaoProposalCardBlockInfo>
          <S.DaoProposalCardBlockInfoValue>
            {proposalType}
          </S.DaoProposalCardBlockInfoValue>
          <S.DaoProposalCardBlockInfoLabel>
            Voting type
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>
        <S.DaoProposalCardBlockInfo alignRight={true}>
          <S.DaoProposalCardBlockInfoValue>
            {votedAddresses}
          </S.DaoProposalCardBlockInfoValue>
          <S.DaoProposalCardBlockInfoLabel>
            Voted addresses
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>
        <S.DaoCenteredButton text={voteEnd} />
      </S.DaoProposalCardBody>
    </S.Root>
  )
}

export default DaoProposalCard
