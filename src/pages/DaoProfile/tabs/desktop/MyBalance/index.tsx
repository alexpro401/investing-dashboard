import React from "react"

import { PoolStatisticsItem } from "common"
import { formatNumber, normalizeBigNumber } from "utils"
import { useTranslation } from "react-i18next"

import onChainImg from "assets/images/onchain-voting.png"

import * as SCommon from "../styled"
import * as S from "./styled"

const MyBalance: React.FC = () => {
  const { t } = useTranslation()

  return (
    <S.Root>
      <S.TutorialBlock>
        <S.TutorialTitle>
          {t("dao-profile.my-balance.tutorial-title")}
        </S.TutorialTitle>
        <S.TutorialBtn>
          {t("dao-profile.my-balance.tutorial-btn")}
        </S.TutorialBtn>
      </S.TutorialBlock>
      <S.OnChainVotingSection>
        <S.OnChainVotingSectionHeader>
          <SCommon.SectionTitle>
            {t("dao-profile.my-balance.section-1-title")}
          </SCommon.SectionTitle>
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

          <S.OnChainVotingContentStatistics>
            <PoolStatisticsItem
              label={t("dao-profile.my-balance.total-voting-power-lbl")}
              value={`$${normalizeBigNumber("5000000000000000000", 18, 2)}`}
              tooltipMsg={"Lorem ipsum dolor sit amet!"}
            />
            <PoolStatisticsItem
              label={t("dao-profile.my-balance.received-rewards-lbl")}
              value={`$${normalizeBigNumber("5000000000000000000", 18, 2)}`}
              tooltipMsg={"Lorem ipsum dolor sit amet!"}
            />
            <PoolStatisticsItem
              label={t("dao-profile.my-balance.claim-available-lbl")}
              value={`$${normalizeBigNumber("5000000000000000000", 18, 2)}`}
              tooltipMsg={"Lorem ipsum dolor sit amet!"}
            />

            <PoolStatisticsItem
              label={t("dao-profile.my-balance.proposal-voting-history-lbl")}
              value={`$${normalizeBigNumber("5000000000000000000", 18, 2)}`}
              tooltipMsg={"Lorem ipsum dolor sit amet!"}
            />
            <PoolStatisticsItem
              label={t("dao-profile.my-balance.delegation-fee-lbl")}
              value={`$${normalizeBigNumber("5000000000000000000", 18, 2)}`}
              tooltipMsg={"Lorem ipsum dolor sit amet!"}
            />
            <PoolStatisticsItem
              label={t("dao-profile.my-balance.apr-lbl")}
              value={`$${normalizeBigNumber("5000000000000000000", 18, 2)}`}
              tooltipMsg={"Lorem ipsum dolor sit amet!"}
            />
          </S.OnChainVotingContentStatistics>
          <S.OnChainClaimButtonWrp>
            <S.OnChainClaimButton
              text={t("dao-profile.my-balance.claim-btn")}
              color="tertiary"
              onClick={() => {}}
              size="small"
            />
          </S.OnChainClaimButtonWrp>
        </S.OnChainVotingContent>
      </S.OnChainVotingSection>
      <S.BalanceSection>
        <S.BalanceSectionTitle>
          {t("dao-profile.my-balance.section-2-title")}
        </S.BalanceSectionTitle>
        <S.BalanceSectionItem>
          <S.BalanceBaseToken
            tokenAddress={""}
            label={t("dao-profile.my-balance.balance-total-lbl")}
            value={formatNumber("5000", 2)}
          />
          <PoolStatisticsItem
            label={t("dao-profile.my-balance.used-in-pool-lbl", {
              poolSymbol: "PLPLPLPL",
            })}
            value={`$${normalizeBigNumber("5000000000000000000", 18, 2)}`}
            tooltipMsg={"Lorem ipsum dolor sit amet!"}
          />
          <PoolStatisticsItem
            label={t("dao-profile.my-balance.delegated-lbl")}
            value={`$${normalizeBigNumber("5000000000000000000", 18, 2)}`}
            tooltipMsg={"Lorem ipsum dolor sit amet!"}
          />
          <PoolStatisticsItem
            label={t("dao-profile.my-balance.available-to-withdraw-lbl")}
            value={`$${normalizeBigNumber("5000000000000000000", 18, 2)}`}
            tooltipMsg={"Lorem ipsum dolor sit amet!"}
          />

          <S.BalanceSectionItemBtn
            text={t("dao-profile.my-balance.withdraw-btn")}
          />
        </S.BalanceSectionItem>
      </S.BalanceSection>
    </S.Root>
  )
}

export default MyBalance
