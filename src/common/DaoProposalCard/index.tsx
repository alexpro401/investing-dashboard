import * as S from "./styled"

import { FC, HTMLAttributes, useState } from "react"
import { normalizeBigNumber, shortenAddress } from "utils"
import { IGovPool } from "interfaces/typechain/GovPool"
import { useGovPoolProposal } from "hooks/dao"
import { useParams } from "react-router-dom"
import { GovProposalCardHead } from "common/dao"

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
  const isInsurance = useState(false)

  return (
    <S.Root {...rest}>
      <GovProposalCardHead
        isInsurance={isInsurance[0]}
        name={name}
        pool={"0xc2e7418baf7eff866da0198c7e8ace4453a6f0a4"}
      />
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
