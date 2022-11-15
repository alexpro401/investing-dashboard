import * as S from "./styled"

import { FC, HTMLAttributes } from "react"
import { ICON_NAMES } from "constants/icon-names"
import { shortenAddress } from "utils"
import { IGovPool } from "interfaces/typechain/GovPool"
import { useGovPoolProposal } from "hooks/dao"

interface Props extends HTMLAttributes<HTMLDivElement> {
  proposalView: IGovPool.ProposalViewStructOutput
}

const DaoProposalCard: FC<Props> = ({ proposalView, ...rest }) => {
  const { name, description, proposalType, voteEnd, votesFor } =
    useGovPoolProposal(proposalView)

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
            {shortenAddress("0x1234567890")}
          </S.DaoProposalCardBlockInfoAddress>
          <S.DaoProposalCardBlockInfoLabel>
            Created by
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>
        <S.DaoProposalCardBlockInfo alignRight={true}>
          <S.DaoProposalCardBlockInfoValue>
            {votesFor}/
            <S.DaoVotingStatusCounterTotal>222</S.DaoVotingStatusCounterTotal>
          </S.DaoProposalCardBlockInfoValue>
          <S.DaoProposalCardBlockInfoLabel>
            Voting status
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>
        <S.DaoVotingProgressBar />
        <S.DaoProposalCardBlockInfo>
          <S.DaoProposalCardBlockInfoValue>
            {proposalType}
          </S.DaoProposalCardBlockInfoValue>
          <S.DaoProposalCardBlockInfoLabel>
            Voting type
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>
        <S.DaoProposalCardBlockInfo alignRight={true}>
          <S.DaoProposalCardBlockInfoValue>20</S.DaoProposalCardBlockInfoValue>
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
