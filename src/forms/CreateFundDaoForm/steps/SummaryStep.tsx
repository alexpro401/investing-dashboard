import { FC, HTMLAttributes, useCallback, useContext, useMemo } from "react"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { stepsControllerContext } from "context/StepsControllerContext"

import * as S from "./styled"
import { useTranslation } from "react-i18next"
import { TokenChip } from "common"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useActiveWeb3React } from "hooks"
import ExternalLink from "components/ExternalLink"
import { createContentLink } from "utils"
import extractRootDomain from "utils/extractRootDomain"
import { SOCIAL_ICONS } from "../../../consts"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const SummaryStep: FC<Props> = ({ ...rest }) => {
  const { account, chainId } = useActiveWeb3React()

  const {
    daoName,
    description,
    websiteUrl,
    socialLinks,
    isTokenCreation,
    tokenCreation,
    erc20,
    erc721,
    documents,
    userKeeperParams,
  } = useContext(GovPoolFormContext)

  const { t } = useTranslation()

  const { nextCb } = useContext(stepsControllerContext)

  const handleNextStep = useCallback(() => {
    nextCb()
  }, [nextCb])

  const descriptionUrl = useMemo(() => {
    return createContentLink(description.get)
  }, [description.get])

  return (
    <>
      <S.StepsRoot {...rest}>
        <S.SummaryTitle>{t("summary-step.title")}</S.SummaryTitle>
        <S.SummaryDesc>{t("summary-step.desc")}</S.SummaryDesc>
        <S.SummaryCardOverhead>
          <S.SummaryCardOverheadTitle>
            <S.SummaryCardOverheadNum number={1} />
            {t("summary-step.overhead-profile-title")}
          </S.SummaryCardOverheadTitle>
          <S.SummaryCardOverheadBtn text={"edit"} />
        </S.SummaryCardOverhead>
        <S.SummaryCard>
          <S.SummaryCardRow>
            <S.SummaryCardLabel>
              {t("summary-step.name-lbl")}
            </S.SummaryCardLabel>
            <S.SummaryCardValue>{daoName.get}</S.SummaryCardValue>
          </S.SummaryCardRow>
          <S.SummaryCardRow>
            <S.SummaryCardLabel>
              {t("summary-step.desc-lbl")}
            </S.SummaryCardLabel>
            <S.SummaryCardValue>
              <ExternalLink href={descriptionUrl}>Open</ExternalLink>
            </S.SummaryCardValue>
          </S.SummaryCardRow>
          <S.SummaryCardRow>
            <S.SummaryCardLabel>
              {t("summary-step.website-lbl")}
            </S.SummaryCardLabel>
            <S.SummaryCardValue>
              <ExternalLink href={websiteUrl.get}>
                {extractRootDomain(websiteUrl.get)}
              </ExternalLink>
            </S.SummaryCardValue>
          </S.SummaryCardRow>
          <S.SummaryCardRow>
            <S.SummaryCardLabel>
              {t("summary-step.socials-lbl")}
            </S.SummaryCardLabel>
            <S.SummaryCardValue>
              {socialLinks.get?.length ? (
                <S.ExternalSocialsWrp>
                  {socialLinks.get
                    .filter((el) => !!el[1])
                    .map(([type, url], idx) => (
                      <S.ExternalSocialsItem
                        key={idx}
                        href={url}
                        target="_blank"
                      >
                        <S.ExternalSocialsIcon name={SOCIAL_ICONS[type]} />
                      </S.ExternalSocialsItem>
                    ))}
                </S.ExternalSocialsWrp>
              ) : (
                <>-</>
              )}
            </S.SummaryCardValue>
          </S.SummaryCardRow>
          <S.SummaryCardRow>
            <S.SummaryCardLabel>
              {t("summary-step.gov-token-lbl")}
            </S.SummaryCardLabel>
            <S.SummaryCardValue>
              <ExternalLink
                href={getExplorerLink(
                  chainId!,
                  userKeeperParams.tokenAddress.get,
                  ExplorerDataType.ADDRESS
                )}
              >
                {erc20?.[1]?.symbol}
              </ExternalLink>
            </S.SummaryCardValue>
          </S.SummaryCardRow>
          <S.SummaryCardRow>
            <S.SummaryCardLabel>
              {t("summary-step.docs-lbl")}
            </S.SummaryCardLabel>
            <S.SummaryCardValue direction="vertical">
              {documents.get?.length ? (
                documents.get.map((el, idx) => (
                  <ExternalLink key={idx} href={el.url}>
                    {el.name}
                  </ExternalLink>
                ))
              ) : (
                <>-</>
              )}
            </S.SummaryCardValue>
          </S.SummaryCardRow>
        </S.SummaryCard>
      </S.StepsRoot>
      <S.FormStepsNavigationWrp
        customNextCb={handleNextStep}
        nextLabel={t("summary-step.next-btn")}
      />
    </>
  )
}

export default SummaryStep
