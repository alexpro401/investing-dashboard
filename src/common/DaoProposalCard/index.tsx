import * as S from "./styled"

import { FC, HTMLAttributes } from "react"
import { normalizeBigNumber, shortenAddress } from "utils"
import { IGovPool } from "interfaces/typechain/GovPool"
import { useGovPoolProposal } from "hooks/dao"
import { useParams } from "react-router-dom"
import { GovProposalCardHead } from "common/dao"
import ProgressLine from "components/ProgressLine"
import { Flex } from "theme"
import TokenIcon from "components/TokenIcon"

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
    executed,
    isInsurance,
    isDistribution,
  } = useGovPoolProposal(proposalId, daoAddress!, proposalView)

  return (
    <S.Root {...rest}>
      <GovProposalCardHead
        isInsurance={isInsurance}
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

        <S.DaoProposalCardBlockInfo alignRight>
          <S.DaoProposalCardBlockInfoValue>
            {normalizeBigNumber(votesFor, 18, 2)}/
            <S.DaoVotingStatusCounterTotal>
              {votesTotalNeed}
            </S.DaoVotingStatusCounterTotal>
          </S.DaoProposalCardBlockInfoValue>
          <S.DaoProposalCardBlockInfoLabel>
            Voting status
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>

        <S.DaoVotingProgressBar>
          <Flex full ai={"center"} jc={"space-between"} gap={"3"}>
            <ProgressLine
              w={
                (votesTotalNeed / 100) *
                Number(normalizeBigNumber(votesFor, 18, 2))
              }
            />
            <ProgressLine w={0} />
          </Flex>
        </S.DaoVotingProgressBar>

        <S.DaoProposalCardBlockInfo>
          {isDistribution ? (
            <Flex full ai={"center"} jc={"flex-start"} gap={"4"}>
              <TokenIcon address={""} m="0" size={20} />
              <S.DaoProposalCardBlockInfoAddress href={""}>
                TOken Name
              </S.DaoProposalCardBlockInfoAddress>
            </Flex>
          ) : (
            <S.DaoProposalCardBlockInfoValue>
              {proposalType}
            </S.DaoProposalCardBlockInfoValue>
          )}
          <S.DaoProposalCardBlockInfoLabel>
            {isDistribution ? proposalType : "Voting type"}
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>

        <S.DaoProposalCardBlockInfo alignRight>
          <S.DaoProposalCardBlockInfoValue success={executed}>
            {executed ? (
              <>
                {isDistribution ? (
                  <>
                    10000
                    <S.DaoVotingStatusCounterTotal>
                      &nbsp;(~$ 1000)
                    </S.DaoVotingStatusCounterTotal>
                  </>
                ) : (
                  "1 DEXE"
                )}
              </>
            ) : (
              votedAddresses
            )}
          </S.DaoProposalCardBlockInfoValue>
          <S.DaoProposalCardBlockInfoLabel>
            {executed ? "My Reward" : "Voted addresses"}
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>

        <S.DaoCenteredButton text={voteEnd} />
      </S.DaoProposalCardBody>
    </S.Root>
  )
}

export default DaoProposalCard
