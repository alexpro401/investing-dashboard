import React from "react"

import onChainImg from "assets/images/onchain-voting.png"
import * as SCommon from "../styled"
import * as S from "./styled"

const MyBalance: React.FC = () => {
  return (
    <S.Root>
      <S.OnChainVotingSection>
        <S.OnChainVotingSectionHeader>
          <SCommon.SectionTitle>Onchain voting</SCommon.SectionTitle>
          <S.OnChainTutorialLink
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            How it works?
          </S.OnChainTutorialLink>
        </S.OnChainVotingSectionHeader>
        <S.OnChainVotingContent>
          <img src={onChainImg} alt="" />
          <div />
          <S.OnChainClaimButtonWrp>
            <S.OnChainClaimButton
              text="Claim all"
              color="tertiary"
              onClick={() => {}}
              size="small"
            />
          </S.OnChainClaimButtonWrp>
        </S.OnChainVotingContent>
      </S.OnChainVotingSection>
    </S.Root>
  )
}

export default MyBalance
