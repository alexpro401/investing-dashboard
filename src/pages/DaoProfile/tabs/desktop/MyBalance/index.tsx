import React from "react"

import { PoolStatisticsItem } from "common"
import { normalizeBigNumber } from "utils"
import { useTranslation } from "react-i18next"

import onChainImg from "assets/images/onchain-voting.png"

import * as SCommon from "../styled"
import * as S from "./styled"
import { ICON_NAMES } from "consts"

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
              value={
                <S.PoolStatisticsItemVal>
                  ${normalizeBigNumber("5000000000000000000", 18, 2)}
                </S.PoolStatisticsItemVal>
              }
              tooltipMsg={"Lorem ipsum dolor sit amet!"}
            />
            <PoolStatisticsItem
              label={t("dao-profile.my-balance.received-rewards-lbl")}
              value={
                <S.PoolStatisticsItemVal>
                  ${normalizeBigNumber("5000000000000000000", 18, 2)}
                </S.PoolStatisticsItemVal>
              }
              tooltipMsg={"Lorem ipsum dolor sit amet!"}
            />
            <PoolStatisticsItem
              label={t("dao-profile.my-balance.claim-available-lbl")}
              value={
                <S.PoolStatisticsItemVal isAccent>
                  ${normalizeBigNumber("5000000000000000000", 18, 2)}
                </S.PoolStatisticsItemVal>
              }
              tooltipMsg={"Lorem ipsum dolor sit amet!"}
            />

            <PoolStatisticsItem
              label={t("dao-profile.my-balance.proposal-voting-history-lbl")}
              value={
                <S.PoolStatisticsItemVal>
                  ${normalizeBigNumber("5000000000000000000", 18, 2)}
                  <S.StatisticItemValIcon name={ICON_NAMES.arrowUpDiagonal} />
                </S.PoolStatisticsItemVal>
              }
              tooltipMsg={"Lorem ipsum dolor sit amet!"}
            />
            <PoolStatisticsItem
              label={t("dao-profile.my-balance.delegation-fee-lbl")}
              value={
                <S.PoolStatisticsItemVal>
                  ${normalizeBigNumber("5000000000000000000", 18, 2)}
                </S.PoolStatisticsItemVal>
              }
              tooltipMsg={"Lorem ipsum dolor sit amet!"}
            />
            <PoolStatisticsItem
              label={t("dao-profile.my-balance.apr-lbl")}
              value={
                <S.PoolStatisticsItemVal>
                  ${normalizeBigNumber("5000000000000000000", 18, 2)}
                </S.PoolStatisticsItemVal>
              }
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
            value={
              <S.StatisticExternalLinkWrp href={""}>
                <S.PoolStatisticsItemVal>{"ASD"}</S.PoolStatisticsItemVal>
              </S.StatisticExternalLinkWrp>
            }
            tooltipMsg={t("dao-profile.my-balance.base-token-tooltip")}
          />
          <PoolStatisticsItem
            label={t("dao-profile.my-balance.used-in-pool-lbl", {
              poolSymbol: "PLPLPLPL",
            })}
            value={
              <S.PoolStatisticsItemVal>
                ${normalizeBigNumber("5000000000000000000", 18, 2)}
              </S.PoolStatisticsItemVal>
            }
            tooltipMsg={"Lorem ipsum dolor sit amet!"}
          />
          <PoolStatisticsItem
            label={t("dao-profile.my-balance.delegated-lbl")}
            value={
              <S.PoolStatisticsItemVal>
                ${normalizeBigNumber("5000000000000000000", 18, 2)}
                <S.StatisticItemValIcon name={ICON_NAMES.arrowUpDiagonal} />
              </S.PoolStatisticsItemVal>
            }
            tooltipMsg={"Lorem ipsum dolor sit amet!"}
          />
          <PoolStatisticsItem
            label={t("dao-profile.my-balance.available-to-withdraw-lbl")}
            value={
              <S.PoolStatisticsItemVal>
                ${normalizeBigNumber("5000000000000000000", 18, 2)}
              </S.PoolStatisticsItemVal>
            }
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
