import * as S from "./styled"

import { FC, HTMLAttributes } from "react"
import { ICON_NAMES } from "constants/icon-names"
import { shortenAddress } from "utils"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalCard: FC<Props> = ({ ...rest }) => {
  return (
    <S.Root {...rest}>
      <S.DaoProposalCardHead>
        <S.DaoProposalCardHeadTitleWrp>
          <S.DaoProposalCardHeadTitle>
            Quarterly distribution of the farming proposal
          </S.DaoProposalCardHeadTitle>
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
            111/
            <S.DaoVotingStatusCounterTotal>222</S.DaoVotingStatusCounterTotal>
          </S.DaoProposalCardBlockInfoValue>
          <S.DaoProposalCardBlockInfoLabel>
            Voting status
          </S.DaoProposalCardBlockInfoLabel>
        </S.DaoProposalCardBlockInfo>
        <S.DaoVotingProgressBar />
        <S.DaoProposalCardBlockInfo>
          <S.DaoProposalCardBlockInfoValue>
            Any other Proposal
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
        <S.DaoCenteredButton text={"Voting ends for 1D : 1H : 1M"} />
      </S.DaoProposalCardBody>
    </S.Root>
  )
}

export default DaoProposalCard
