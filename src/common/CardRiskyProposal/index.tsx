import * as React from "react"
import * as S from "./styled"

import { v4 as uuidv4 } from "uuid"
import { formatUnits } from "@ethersproject/units"
import { generatePath, useNavigate } from "react-router-dom"

import { useBreakpoints, useRiskyProposalView } from "hooks"
import { IRiskyProposalInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"
import { normalizeBigNumber } from "utils"
import { ICON_NAMES, ROUTE_PATHS } from "consts"

import { Flex } from "theme"
import { AppButton, Icon as IconCommon } from "common"

import Icon from "components/Icon"
import ReadMore from "components/ReadMore"
import TokenIcon from "components/TokenIcon"
import IconButton from "components/IconButton"
import ExternalLink from "components/ExternalLink"
import ProgressColorized from "components/ProgressColorized"
import UpdateRiskyProposalForm from "forms/UpdateRiskyProposalForm"

import checkGreenIcon from "assets/icons/green-check.svg"
import settingsIcon from "assets/icons/settings.svg"
import settingsGreenIcon from "assets/icons/settings-green.svg"
import traderBadgeDangerIcon from "assets/icons/trader-badge-danger.svg"
import traderBadgeWarningIcon from "assets/icons/trader-badge-warning.svg"
import traderBadgeSuccessIcon from "assets/icons/trader-badge-success.svg"

function getTraderQualityIcon(quality) {
  switch (quality) {
    case "danger":
      return traderBadgeDangerIcon
    case "warning":
      return traderBadgeWarningIcon
    case "success":
    default:
      return traderBadgeSuccessIcon
  }
}

interface Props {
  proposal: IRiskyProposalInfo[0]
  proposalId: number
  poolAddress: string
}

const CardRiskyProposal: React.FC<Props> = (props) => {
  const { proposal, proposalId, poolAddress } = props

  const [
    {
      tokenRating,
      canInvest,
      proposalTokenLink,
      maxSizeLP,
      yourSizeLP,
      traderSizeLP,
      fullness,
      maxInvestPrice,
      currentPrice,
      expirationDate,
      investors,
      positionSize,
      proposalToken,
      traderSizePercentage,
      description,
      maximumPoolInvestors,
      isTrader,
      proposalContract,
      poolInfo,
      poolMetadata,
    },
    { onUpdateRestrictions },
  ] = useRiskyProposalView(props)

  const { isDesktop } = useBreakpoints()
  const navigate = useNavigate()

  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false)

  const proposalTokenSymbol = React.useMemo<string>(() => {
    if (!proposalToken || !proposalToken.symbol) return ""
    return proposalToken.symbol
  }, [proposalToken])

  const proposalInvestPath = React.useMemo(
    () =>
      generatePath(ROUTE_PATHS.riskyProposalInvest, {
        poolAddress: poolAddress,
        proposalId: String(proposalId),
      }),
    [poolAddress, proposalId]
  )

  const navigateToPool = React.useCallback(
    (e: React.MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      navigate(
        generatePath(ROUTE_PATHS.poolProfile, {
          poolAddress: poolAddress,
          "*": "",
        })
      )
    },
    [navigate, poolAddress]
  )

  /**
   * Navigate to risky invest terminal
   * @param e - click event
   */
  const onRiskyProposalInvest = React.useCallback(
    (e: React.MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      navigate(proposalInvestPath)
    },
    [navigate, proposalInvestPath]
  )

  /**
   * Navigate to risky invest terminal
   * @param e - click event
   */
  const onInvest = React.useCallback(
    (e: React.MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      const path = isTrader
        ? proposalInvestPath
        : generatePath(ROUTE_PATHS.riskyProposalSwap, {
            poolAddress,
            proposalId: String(proposalId),
            direction: "deposit",
          })

      navigate(path)
    },
    [navigate, poolAddress, proposalId, isTrader]
  )

  return (
    <S.Root>
      <S.CardRiskyProposalBody>
        <S.CardRiskyProposalGrid isTrader={isTrader}>
          <S.CardRiskyProposalGridItemToken>
            <S.CardRiskyProposalTokenWrp>
              <TokenIcon
                m="0"
                size={isDesktop ? 36 : 24}
                address={proposal.proposalInfo.token}
              />
              <S.CardRiskyProposalTokenInfoWrp>
                <S.CardRiskyProposalTokenInfoLabel>
                  {"Proposal token"}
                </S.CardRiskyProposalTokenInfoLabel>

                <S.CardRiskyProposalTokenInfoValue
                  as="a"
                  target="_blank"
                  href={proposalTokenLink}
                  rel="noopener noreferrer"
                >
                  {proposalTokenSymbol}
                  <S.CardRiskyProposalTokenInfoIcon
                    name={ICON_NAMES.externalLink}
                  />
                </S.CardRiskyProposalTokenInfoValue>
                <S.CardRiskyProposalTokenInfoRating rating={tokenRating} />
                <S.CardRiskyProposalTokenInfoTooltip
                  id={uuidv4()}
                  size={isDesktop ? "normal" : "small"}
                >
                  Risky proposal rating info
                </S.CardRiskyProposalTokenInfoTooltip>
              </S.CardRiskyProposalTokenInfoWrp>
            </S.CardRiskyProposalTokenWrp>
          </S.CardRiskyProposalGridItemToken>

          {isTrader ? (
            <S.CardRiskyProposalGridItemSettingsAction>
              {isDesktop ? (
                <S.CardRiskyProposalSettingsButton
                  full
                  text={"Settings"}
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  size="small"
                  color={"default"}
                />
              ) : (
                <Flex>
                  <S.CardRiskyProposalStatus active={canInvest ?? false}>
                    {canInvest ? "Open investing" : "Closed investing"}
                  </S.CardRiskyProposalStatus>
                  <IconButton
                    size={12}
                    media={isSettingsOpen ? settingsGreenIcon : settingsIcon}
                    onClick={() => {
                      setIsSettingsOpen(!isSettingsOpen)
                    }}
                  />
                </Flex>
              )}
            </S.CardRiskyProposalGridItemSettingsAction>
          ) : (
            <S.CardRiskyProposalGridItemBaseToken onClick={navigateToPool}>
              <S.CardRiskyProposalBaseTokenWrp>
                <S.CardRiskyProposalValueWrp
                  alignment={!isDesktop ? "flex-end" : undefined}
                >
                  {isDesktop && (
                    <S.CardRiskyProposalLabel>
                      {"Fund ticker"}
                    </S.CardRiskyProposalLabel>
                  )}
                  <S.CardRiskyProposalValue completed={!isDesktop}>
                    {poolInfo?.ticker ?? ""}
                  </S.CardRiskyProposalValue>
                </S.CardRiskyProposalValueWrp>
                <TokenIcon
                  m="0"
                  size={isDesktop ? 36 : 24}
                  address={poolInfo?.parameters.baseToken}
                />
              </S.CardRiskyProposalBaseTokenWrp>
            </S.CardRiskyProposalGridItemBaseToken>
          )}

          <S.CardRiskyProposalGridItemDividerTop />

          <S.CardRiskyProposalGridItemMaxSize>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>
                    {isTrader ? "Max size (LP)" : "Proposal size (LP)"}
                  </span>
                  {isDesktop && (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Proposal size LP info"}
                    </S.CardRiskyProposalLabelTooltip>
                  )}
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue>
                {normalizeBigNumber(maxSizeLP, 18, 6)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemMaxSize>

          <S.CardRiskyProposalGridItemCurrentUserSize>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>{"Your size (LP)"}</span>
                  {isTrader ? (
                    <S.CardRiskyProposalInvestMoreButton
                      text={"+ Add"}
                      onClick={onRiskyProposalInvest}
                      size={"x-small"}
                      color={isDesktop ? "secondary" : "default"}
                    />
                  ) : (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Your size LP info"}
                    </S.CardRiskyProposalLabelTooltip>
                  )}
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue>
                {normalizeBigNumber(yourSizeLP, 18, 6)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemCurrentUserSize>

          <S.CardRiskyProposalGridItemFullness>
            <S.CardRiskyProposalValueWrp
              alignment={!isDesktop ? "flex-end" : undefined}
            >
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>{"Fullness (LP)"}</span>
                  {isDesktop && (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Fullness(LP) info"}
                    </S.CardRiskyProposalLabelTooltip>
                  )}
                  {!isDesktop && fullness.completed && (
                    <img src={checkGreenIcon} />
                  )}
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue completed={fullness.completed}>
                {normalizeBigNumber(fullness.value, 18, 6)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemFullness>

          <S.CardRiskyProposalGridItemMaxInvestPrice>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>
                    {String("Max. Invest Price").concat(
                      ` (${proposalTokenSymbol})`
                    )}
                  </span>
                  {isDesktop && (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Max.Invest Price info"}
                    </S.CardRiskyProposalLabelTooltip>
                  )}
                  {!isDesktop && maxInvestPrice.completed && (
                    <img src={checkGreenIcon} />
                  )}
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue completed={maxInvestPrice.completed}>
                {normalizeBigNumber(maxInvestPrice.value, 18, 2)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemMaxInvestPrice>

          <S.CardRiskyProposalGridItemCurrentPrice>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>
                    {String("Current price").concat(
                      ` (${proposalTokenSymbol})`
                    )}
                  </span>
                  {isDesktop && (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Current price info"}
                    </S.CardRiskyProposalLabelTooltip>
                  )}
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue>
                {normalizeBigNumber(currentPrice, 18, 2)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemCurrentPrice>

          <S.CardRiskyProposalGridItemExpirationDate>
            <S.CardRiskyProposalValueWrp
              alignment={!isDesktop ? "flex-end" : undefined}
            >
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>{"Expiration date"}</span>
                  {isDesktop && (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Expiration date info"}
                    </S.CardRiskyProposalLabelTooltip>
                  )}
                  {!isDesktop && expirationDate.completed && (
                    <img src={checkGreenIcon} />
                  )}
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue
                completed={expirationDate.completed}
                small={!isDesktop}
              >
                {expirationDate.value}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemExpirationDate>

          <S.CardRiskyProposalGridItemInvestors>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>{"Investors"}</span>
                  {isDesktop && (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Investors info"}
                    </S.CardRiskyProposalLabelTooltip>
                  )}
                  {!isDesktop && investors.completed && (
                    <img src={checkGreenIcon} />
                  )}
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue completed={investors.completed}>
                {investors.value.toString()}{" "}
                <span>/ {formatUnits(maximumPoolInvestors, "wei")}</span>
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemInvestors>

          <S.CardRiskyProposalGridItemPositionSize>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>
                    {String("Position size").concat(
                      ` (${proposalTokenSymbol})`
                    )}
                  </span>
                  {isDesktop && (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Position size info"}
                    </S.CardRiskyProposalLabelTooltip>
                  )}
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue>
                {normalizeBigNumber(positionSize, 18, 6)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemPositionSize>

          <S.CardRiskyProposalGridItemInvestAction>
            <AppButton
              full
              text={isTrader ? "Terminal" : "Stake LP"}
              onClick={onInvest}
              size="x-small"
              disabled={!canInvest}
              color={canInvest ? "tertiary" : "secondary"}
            />
          </S.CardRiskyProposalGridItemInvestAction>

          <S.CardRiskyProposalGridItemDescription>
            <S.CardRiskyProposalDescriptionWrp>
              {isDesktop && <IconCommon name={ICON_NAMES.fileDock} />}
              <ReadMore
                content={
                  description.length > 0
                    ? description
                    : "No description provided to proposal"
                }
                maxLen={isDesktop ? 140 : undefined}
              />
            </S.CardRiskyProposalDescriptionWrp>
          </S.CardRiskyProposalGridItemDescription>

          {!isTrader && (
            <>
              {!isDesktop && <S.CardRiskyProposalGridItemDividerBottom />}
              <S.CardRiskyProposalGridItemTraderSize>
                {isDesktop ? (
                  <S.CardRiskyProposalValueWrp>
                    <S.CardRiskyProposalLabel>
                      <S.CardRiskyProposalLabelContent>
                        <span>{"Trader size"}</span>
                        <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                          {"Trader size info"}
                        </S.CardRiskyProposalLabelTooltip>
                      </S.CardRiskyProposalLabelContent>
                    </S.CardRiskyProposalLabel>
                    <S.CardRiskyProposalValue>
                      <Flex gap={"4"} ai={"center"}>
                        <IconCommon name={ICON_NAMES.warnCircledFilled} />
                        {normalizeBigNumber(traderSizeLP, 18, 2)} (
                        {normalizeBigNumber(traderSizePercentage, 18, 2)}%)
                      </Flex>
                    </S.CardRiskyProposalValue>
                  </S.CardRiskyProposalValueWrp>
                ) : (
                  <S.CardRiskyProposalTraderSizeWrp>
                    <S.CardRiskyProposalTraderSizeIconWrp>
                      <Icon
                        size={24}
                        m="0"
                        source={
                          poolMetadata?.assets[poolMetadata?.assets.length - 1]
                        }
                        address={poolAddress}
                      />
                      <S.CardRiskyProposalTraderSizeQualityIcon
                        src={getTraderQualityIcon(undefined)}
                      />
                    </S.CardRiskyProposalTraderSizeIconWrp>
                    <S.CardRiskyProposalTraderSizeInfoWrp>
                      <S.CardRiskyProposalTraderSizeText>
                        Trader size: {normalizeBigNumber(traderSizeLP, 18, 2)}{" "}
                        LP ({normalizeBigNumber(traderSizePercentage, 18, 2)}%)
                      </S.CardRiskyProposalTraderSizeText>
                      <S.CardRiskyProposalTraderSizeProgressWrp>
                        <ProgressColorized
                          size={Number(
                            normalizeBigNumber(traderSizePercentage, 18, 2)
                          )}
                        />
                      </S.CardRiskyProposalTraderSizeProgressWrp>
                    </S.CardRiskyProposalTraderSizeInfoWrp>
                  </S.CardRiskyProposalTraderSizeWrp>
                )}
              </S.CardRiskyProposalGridItemTraderSize>
              {!isDesktop && (
                <S.CardRiskyProposalGridItemCheckToken>
                  <S.CardRiskyProposalCheckTokenWrp>
                    <ExternalLink color="#2680EB" href={proposalTokenLink}>
                      {"Сheck token"}
                    </ExternalLink>
                  </S.CardRiskyProposalCheckTokenWrp>
                </S.CardRiskyProposalGridItemCheckToken>
              )}
            </>
          )}
        </S.CardRiskyProposalGrid>
      </S.CardRiskyProposalBody>
      {isSettingsOpen && (
        <S.CardRiskyProposalUpdateFormWrp>
          <UpdateRiskyProposalForm
            visible={isSettingsOpen}
            setVisible={setIsSettingsOpen}
            timestamp={expirationDate.initial}
            maxSizeLP={maxSizeLP}
            maxInvestPrice={maxInvestPrice.value}
            proposalContract={proposalContract}
            fullness={fullness.value}
            currentPrice={currentPrice}
            proposalId={proposalId - 1}
            successCallback={onUpdateRestrictions}
            proposalSymbol={proposalTokenSymbol}
            poolAddress={poolAddress}
          />
        </S.CardRiskyProposalUpdateFormWrp>
      )}
    </S.Root>
  )
}

export default CardRiskyProposal
