import { FC, HTMLAttributes, useCallback, useContext, useMemo } from "react"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { stepsControllerContext } from "context/StepsControllerContext"

import * as S from "./styled"
import { useTranslation } from "react-i18next"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useActiveWeb3React } from "hooks"
import ExternalLink from "components/ExternalLink"
import { createContentLink, shortenAddress } from "utils"
import extractRootDomain from "utils/extractRootDomain"
import { SOCIAL_ICONS } from "consts"
import Switch from "components/Switch"
import { parseDuration, parseDurationString, parseSeconds } from "utils/time"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const SummaryStep: FC<Props> = ({ ...rest }) => {
  const { chainId } = useActiveWeb3React()

  const {
    daoName,
    description,
    websiteUrl,
    socialLinks,
    erc20,
    erc721,
    documents,
    userKeeperParams,

    isValidator,
    validatorsParams,

    defaultProposalSettingForm,

    isCustomVoting,
    internalProposalForm,

    isDistributionProposal,
    distributionProposalSettingsForm,
  } = useContext(GovPoolFormContext)

  const { t } = useTranslation()

  const { nextCb, setStep } = useContext(stepsControllerContext)

  const handleNextStep = useCallback(() => {
    nextCb()
  }, [nextCb])

  const descriptionUrl = useMemo(() => {
    return createContentLink(description.get)
  }, [description.get])

  const parseSecondsToString = useCallback(
    (seconds: string | number) =>
      parseDurationString(parseDuration(parseSeconds(seconds))),
    []
  )

  const handleEditBtn = useCallback(
    (step: number) => {
      if (!setStep) return

      setStep(step)
    },
    [setStep]
  )

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
          <S.SummaryCardOverheadBtn
            text={t("summary-step.edit-btn")}
            onClick={() => handleEditBtn(1)}
          />
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

        <S.SummaryCardOverhead>
          <S.SummaryCardOverheadTitle>
            <S.SummaryCardOverheadNum number={2} />
            {t("summary-step.overhead-validators-title")}
          </S.SummaryCardOverheadTitle>
          <S.SummaryCardOverheadBtn
            text={t("summary-step.edit-btn")}
            onClick={() => handleEditBtn(2)}
          />
        </S.SummaryCardOverhead>
        <S.SummaryCard>
          <S.SummaryCardRow>
            <S.SummaryCardLabel>
              {t("summary-step.is-validator-lbl")}
            </S.SummaryCardLabel>
            <S.SummaryCardValue>
              <Switch
                isOn={isValidator.get}
                onChange={() => {}}
                name="is-validator"
                disabled={true}
              />
            </S.SummaryCardValue>
          </S.SummaryCardRow>
          {isValidator.get ? (
            <>
              <S.SummaryCardRow>
                <S.SummaryCardLabel>
                  {t("summary-step.validator-token-name-lbl")}
                </S.SummaryCardLabel>
                <S.SummaryCardValue>
                  {validatorsParams.name.get}
                </S.SummaryCardValue>
              </S.SummaryCardRow>
              <S.SummaryCardRow>
                <S.SummaryCardLabel>
                  {t("summary-step.validator-token-symbol-lbl")}
                </S.SummaryCardLabel>
                <S.SummaryCardValue>
                  {validatorsParams.symbol.get}
                </S.SummaryCardValue>
              </S.SummaryCardRow>
              <S.SummaryCardRow>
                <S.SummaryCardLabel>
                  {t("summary-step.validator-voting-duration-lbl")}
                </S.SummaryCardLabel>
                <S.SummaryCardValue
                  title={parseSecondsToString(validatorsParams.duration.get)}
                >
                  {parseSecondsToString(validatorsParams.duration.get)}
                </S.SummaryCardValue>
              </S.SummaryCardRow>
              <S.SummaryCardRow>
                <S.SummaryCardLabel>
                  {t("summary-step.validator-voting-quorum-lbl")}
                </S.SummaryCardLabel>
                <S.SummaryCardValue>
                  {validatorsParams.quorum.get}%
                </S.SummaryCardValue>
              </S.SummaryCardRow>
            </>
          ) : (
            <></>
          )}
        </S.SummaryCard>

        {isValidator.get ? (
          <>
            <S.SummaryCardOverhead>
              <S.SummaryCardOverheadTitle>
                {t("summary-step.overhead-validators-list-title")}
              </S.SummaryCardOverheadTitle>
            </S.SummaryCardOverhead>
            <S.SummaryCard>
              {validatorsParams.validators.get?.length ? (
                validatorsParams.validators.get.map((el, idx) => (
                  <S.SummaryCardRow key={idx}>
                    <S.SummaryCardLabel>
                      <ExternalLink
                        href={getExplorerLink(
                          chainId!,
                          el,
                          ExplorerDataType.ADDRESS
                        )}
                      >
                        {shortenAddress(el)}
                      </ExternalLink>
                    </S.SummaryCardLabel>
                    <S.SummaryCardValue>
                      {validatorsParams.balances.get[idx]}
                      <S.SummaryCardLabel>
                        {validatorsParams.symbol.get}
                      </S.SummaryCardLabel>
                    </S.SummaryCardValue>
                  </S.SummaryCardRow>
                ))
              ) : (
                <></>
              )}
            </S.SummaryCard>
          </>
        ) : (
          <></>
        )}

        {[
          {
            settings: defaultProposalSettingForm,
            stepNumber: 3,
            overheadTitle: t("summary-step.overhead-default-settings-title"),
          },
          ...(isCustomVoting.get
            ? [
                {
                  settings: internalProposalForm,
                  stepNumber: 4,
                  overheadTitle: t(
                    "summary-step.overhead-internal-settings-title"
                  ),
                },
              ]
            : []),
          ...(isDistributionProposal.get
            ? [
                {
                  settings: distributionProposalSettingsForm,
                  stepNumber: 5,
                  overheadTitle: t(
                    "summary-step.overhead-distribution-settings-title"
                  ),
                },
              ]
            : []),
        ].map((el, idx) => {
          return (
            <>
              <S.SummaryCardOverhead>
                <S.SummaryCardOverheadTitle>
                  <S.SummaryCardOverheadNum number={idx + 3} />
                  {el.overheadTitle}
                </S.SummaryCardOverheadTitle>
                <S.SummaryCardOverheadBtn
                  text={t("summary-step.edit-btn")}
                  onClick={() => handleEditBtn(el.stepNumber)}
                />
              </S.SummaryCardOverhead>
              <S.SummaryCard>
                <S.SummaryCardRow>
                  <S.SummaryCardLabel>
                    {t("summary-step.settings-duration-lbl")}
                  </S.SummaryCardLabel>
                  <S.SummaryCardValue>
                    {parseSecondsToString(el.settings.duration.get)}
                  </S.SummaryCardValue>
                </S.SummaryCardRow>
                <S.SummaryCardRow>
                  <S.SummaryCardLabel>
                    {t("summary-step.settings-is-delegation-lbl")}
                  </S.SummaryCardLabel>
                  <S.SummaryCardValue>
                    <Switch
                      isOn={el.settings.delegatedVotingAllowed.get}
                      onChange={() => {}}
                      name={`delegated-voting-allowed-${idx}`}
                    />
                  </S.SummaryCardValue>
                </S.SummaryCardRow>
                <S.SummaryCardRow>
                  <S.SummaryCardLabel>
                    {t("summary-step.settings-quorum-lbl")}
                  </S.SummaryCardLabel>
                  <S.SummaryCardValue>
                    {el.settings.quorum.get}
                  </S.SummaryCardValue>
                </S.SummaryCardRow>
                <S.SummaryCardRow>
                  <S.SummaryCardLabel>
                    {t("summary-step.settings-voting-min-power-lbl")}
                  </S.SummaryCardLabel>
                  <S.SummaryCardValue>
                    {el.settings.minVotesForVoting.get}
                  </S.SummaryCardValue>
                </S.SummaryCardRow>
                <S.SummaryCardRow>
                  <S.SummaryCardLabel>
                    {t("summary-step.settings-create-proposal-min-power-lbl")}
                  </S.SummaryCardLabel>
                  <S.SummaryCardValue>
                    {el.settings.minVotesForCreating.get}
                  </S.SummaryCardValue>
                </S.SummaryCardRow>
                <S.SummaryCardRow>
                  <S.SummaryCardLabel>
                    {t("summary-step.settings-early-completion-lbl")}
                  </S.SummaryCardLabel>
                  <S.SummaryCardValue>
                    <Switch
                      isOn={el.settings.earlyCompletion.get}
                      onChange={() => {}}
                      name={`early-completion-${idx}`}
                    />
                  </S.SummaryCardValue>
                </S.SummaryCardRow>
                <S.SummaryCardRow>
                  <S.SummaryCardLabel>
                    {t("summary-step.settings-validator-voting-duration-lbl")}
                  </S.SummaryCardLabel>
                  <S.SummaryCardValue>
                    {parseSecondsToString(el.settings.durationValidators.get) ||
                      "-"}
                  </S.SummaryCardValue>
                </S.SummaryCardRow>
                <S.SummaryCardRow>
                  <S.SummaryCardLabel>
                    {t("summary-step.settings-validator-quorum-lbl")}
                  </S.SummaryCardLabel>
                  <S.SummaryCardValue>
                    {el.settings.quorumValidators.get}
                  </S.SummaryCardValue>
                </S.SummaryCardRow>
                <S.SummaryCardRow>
                  <S.SummaryCardLabel>
                    {t("summary-step.settings-reward-lbl")}
                  </S.SummaryCardLabel>
                  <S.SummaryCardValue>
                    <Switch
                      isOn={el.settings.delegatedVotingAllowed.get}
                      onChange={() => {}}
                      name={`delegated-voting-allowed-${idx}`}
                    />
                  </S.SummaryCardValue>
                </S.SummaryCardRow>
                {el.settings.delegatedVotingAllowed.get ? (
                  <>
                    <S.SummaryCardRow>
                      <S.SummaryCardLabel>
                        {t("summary-step.settings-reward-token-lbl")}
                      </S.SummaryCardLabel>
                      <S.SummaryCardValue>
                        <ExternalLink
                          href={getExplorerLink(
                            chainId!,
                            el.settings.rewardToken.get,
                            ExplorerDataType.ADDRESS
                          )}
                        >
                          {el.settings.rewardToken.get}
                        </ExternalLink>
                      </S.SummaryCardValue>
                    </S.SummaryCardRow>
                    <S.SummaryCardRow>
                      <S.SummaryCardLabel>
                        {t("summary-step.settings-reward-for-creator-lbl")}
                      </S.SummaryCardLabel>
                      <S.SummaryCardValue>
                        {el.settings.creationReward.get}
                      </S.SummaryCardValue>
                    </S.SummaryCardRow>
                    <S.SummaryCardRow>
                      <S.SummaryCardLabel>
                        {t("summary-step.settings-reward-for-voter-lbl")}
                      </S.SummaryCardLabel>
                      <S.SummaryCardValue>
                        {el.settings.voteRewardsCoefficient.get}
                      </S.SummaryCardValue>
                    </S.SummaryCardRow>
                    <S.SummaryCardRow>
                      <S.SummaryCardLabel>
                        {t("summary-step.settings-reward-for-executor-lbl")}
                      </S.SummaryCardLabel>
                      <S.SummaryCardValue>
                        {el.settings.executionReward.get}
                      </S.SummaryCardValue>
                    </S.SummaryCardRow>
                  </>
                ) : (
                  <></>
                )}
              </S.SummaryCard>
            </>
          )
        })}
      </S.StepsRoot>
      <S.FormStepsNavigationWrp
        customNextCb={handleNextStep}
        nextLabel={t("summary-step.next-btn")}
      />
    </>
  )
}

export default SummaryStep
