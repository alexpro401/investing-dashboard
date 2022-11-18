import * as S from "./styled"

import { FC, HTMLAttributes, useState } from "react"
import { normalizeBigNumber, shortenAddress } from "utils"
import { IGovPool } from "interfaces/typechain/GovPool"
import { useGovPoolProposal } from "hooks/dao"
import { useParams } from "react-router-dom"
import { GovProposalCardHead, GovProposalCardBlockInfo } from "common/dao"
import ProgressLine from "components/ProgressLine"
import { Flex } from "theme"

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
        <GovProposalCardBlockInfo
          label={"Created by"}
          value={
            <S.DaoProposalCardBlockInfoAddress href={""}>
              {shortenAddress(creator)}
            </S.DaoProposalCardBlockInfoAddress>
          }
        />
        <GovProposalCardBlockInfo
          label={"Voting status"}
          value={
            <>
              {normalizeBigNumber(votesFor, 18, 2)}/
              <S.DaoVotingStatusCounterTotal>
                {votesTotalNeed}
              </S.DaoVotingStatusCounterTotal>
            </>
          }
          align={"right"}
        />
        <S.DaoVotingProgressBar>
          <Flex full ai={"center"} jc={"space-between"} gap={"3"}>
            <div style={{ width: "50%" }}>
              <ProgressLine
                w={
                  (votesTotalNeed / 100) *
                  Number(normalizeBigNumber(votesFor, 18, 2))
                }
              />
            </div>
            <div style={{ width: "50%" }}>
              <ProgressLine w={0} />
            </div>
          </Flex>
        </S.DaoVotingProgressBar>
        <GovProposalCardBlockInfo label={"Voting type"} value={proposalType} />
        <GovProposalCardBlockInfo
          label={"Voted addresses"}
          value={votedAddresses}
          align={"right"}
        />

        <S.DaoCenteredButton text={voteEnd} />
      </S.DaoProposalCardBody>
    </S.Root>
  )
}

export default DaoProposalCard
