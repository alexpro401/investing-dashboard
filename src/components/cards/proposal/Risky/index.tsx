import { FC, useMemo, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { useBreakpoints, useRiskyProposalView } from "hooks"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { normalizeBigNumber } from "utils"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

import theme, { Flex } from "theme"
import Icon from "components/Icon"
import Tooltip from "components/Tooltip"
import TokenIcon from "components/TokenIcon"
import IconButton from "components/IconButton"
import ExternalLink from "components/ExternalLink"
import { AppButton, Icon as IconCommon } from "common"

import * as S from "./styled"
import { BodyItem } from "components/cards/proposal/_shared"
import * as SharedS from "components/cards/proposal/styled"
import {
  Rating,
  RiskyCardSettings,
  TraderInfoBadge,
  TraderLPSize,
} from "./components"

import settingsIcon from "assets/icons/settings.svg"
import settingsGreenIcon from "assets/icons/settings-green.svg"
import { TraderPoolRiskyProposal } from "interfaces/typechain"
import { IRiskyProposalInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"
import { ICON_NAMES } from "consts"
import ReadMore from "components/ReadMore"

const MAX_INVESTORS_COUNT = 1000

interface Props {
  proposal: IRiskyProposalInfo[0]
  proposalId: number
  poolAddress: string
  proposalPool: TraderPoolRiskyProposal
  isTrader: boolean
  poolInfo: IPoolInfo
}

const RiskyProposalCard: FC<Props> = (props) => {
  const {
    proposal,
    proposalId,
    poolAddress,
    proposalPool,
    isTrader,
    poolInfo,
  } = props

  const ipfsUrl = poolInfo?.parameters.descriptionURL ?? ""
  const [{ poolMetadata }] = usePoolMetadata(poolAddress, ipfsUrl)

  const [
    {
      proposalSymbol,
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
    },
    { navigateToPool, onAddMore, onInvest, onUpdateRestrictions },
  ] = useRiskyProposalView(props)

  const { isDesktop } = useBreakpoints()
  const [tooltip, showTooltip] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)

  const showFooter = useMemo(() => {
    return (!isDesktop && !isTrader) || isDesktop
  }, [isDesktop, isTrader])

  const ProposalTokenView = useMemo(() => {
    if (!isDesktop) {
      return (
        <Flex>
          <TokenIcon address={proposal.proposalInfo.token} m="0" size={24} />

          {isTrader ? (
            <SharedS.Title>{proposalSymbol}</SharedS.Title>
          ) : (
            <Flex ai="center">
              <SharedS.Title>{proposalSymbol}</SharedS.Title>
              <Rating rating={tokenRating} />
              <Flex m="0 0 -5px">
                <Tooltip id={uuidv4()} size="small">
                  Risky proposal rating info
                </Tooltip>
              </Flex>
            </Flex>
          )}
        </Flex>
      )
    }

    return (
      <Flex gap={"8"}>
        <TokenIcon address={proposal.proposalInfo.token} m="0" size={36} />
        <BodyItem
          label="Proposal token"
          amount={
            <Flex ai="center" gap={"8"}>
              <ExternalLink
                color={theme.textColors.primary}
                href={proposalTokenLink}
                fz={"16px"}
                fw={"700"}
                iconSize={isDesktop ? "20px" : "15px"}
              >
                {proposalSymbol}
              </ExternalLink>

              <Rating rating={tokenRating} />
            </Flex>
          }
        />
      </Flex>
    )
  }, [
    isDesktop,
    proposal,
    proposalTokenLink,
    proposalSymbol,
    tokenRating,
    isTrader,
  ])

  const PoolTokenView = useMemo(() => {
    if (!isDesktop) {
      return (
        <Flex onClick={navigateToPool} gap={"4"}>
          <S.Ticker>{poolInfo?.ticker ?? ""}</S.Ticker>
          <TokenIcon address={poolInfo?.parameters.baseToken} m="0" size={24} />
        </Flex>
      )
    }

    return (
      <Flex gap={"8"}>
        <TokenIcon
          address={poolInfo?.parameters.baseToken}
          m="0"
          size={isDesktop ? 36 : 24}
        />
        <BodyItem label="Fund ticker" amount={poolInfo?.ticker ?? ""} />
      </Flex>
    )
  }, [isDesktop, poolInfo, navigateToPool])

  const TraderSizeView = useMemo(() => {
    if (isDesktop) {
      return (
        <BodyItem
          label={"Trader size"}
          amount={
            <Flex gap={"4"} ai={"center"}>
              <IconCommon name={ICON_NAMES.warnCircledFilled} />
              <span>{normalizeBigNumber(traderSizeLP, 18, 2)}</span>
              <span>({normalizeBigNumber(traderSizePercentage, 18, 2)}%)</span>
            </Flex>
          }
        />
      )
    }

    return (
      <Flex dir="column" ai="flex-start" m="0 0 0 4px">
        <SharedS.SizeTitle>
          Trader size: {normalizeBigNumber(traderSizeLP, 18, 2)} LP (
          {normalizeBigNumber(traderSizePercentage, 18, 2)}%)
        </SharedS.SizeTitle>
        <SharedS.LPSizeContainer>
          <TraderLPSize
            size={Number(normalizeBigNumber(traderSizePercentage, 18, 2))}
          />
        </SharedS.LPSizeContainer>
      </Flex>
    )
  }, [isDesktop, traderSizeLP, traderSizePercentage])

  return (
    <S.Root>
      <SharedS.Root>
        <SharedS.Card>
          <SharedS.Head p={isTrader ? "8px 8px 7px 16px" : "8px 16px 7px 16px"}>
            {ProposalTokenView}

            {isTrader && !isDesktop ? (
              <Flex>
                <S.Status active={canInvest ?? false}>
                  {canInvest ? "Open investing" : "Closed investing"}
                </S.Status>
                <Flex m="0 0 0 4px">
                  <IconButton
                    size={12}
                    media={isSettingsOpen ? settingsGreenIcon : settingsIcon}
                    onClick={() => {
                      setIsSettingsOpen(!isSettingsOpen)
                    }}
                  />
                </Flex>
              </Flex>
            ) : (
              PoolTokenView
            )}
          </SharedS.Head>

          <SharedS.Body>
            <BodyItem
              label={isTrader ? "Max size (LP)" : "Proposal size LP"}
              amount={normalizeBigNumber(maxSizeLP, 18, 6)}
            />
            <BodyItem
              label={
                <Flex>
                  <span>Your size (LP)</span>
                  {isTrader && (
                    <S.AddButton
                      text={"+ Add"}
                      onClick={onAddMore}
                      size={"x-small"}
                      color={isDesktop ? "secondary" : "default"}
                    />
                  )}
                </Flex>
              }
              amount={normalizeBigNumber(yourSizeLP, 18, 6)}
            />
            <BodyItem
              label="Fullness (LP)"
              amount={normalizeBigNumber(fullness.value, 18, 6)}
              completed={fullness.completed}
              ai="flex-end"
            />
            <BodyItem
              label={`Max. Invest Price (${proposalSymbol})`}
              amount={normalizeBigNumber(maxInvestPrice.value, 18, 2)}
              completed={maxInvestPrice.completed}
            />

            <BodyItem
              label={`Current price (${proposalSymbol})`}
              amount={normalizeBigNumber(currentPrice, 18, 2)}
            />

            <BodyItem
              fz={"11px"}
              label="Expiration date"
              amount={expirationDate.value}
              completed={expirationDate.completed}
              ai="flex-end"
            />
            <BodyItem
              label="Investors"
              amount={investors.value}
              completed={investors.completed}
              symbol={`/ ${MAX_INVESTORS_COUNT}`}
            />
            <BodyItem
              label={`Position size (${proposalSymbol})`}
              amount={positionSize}
            />
            {!isDesktop && (
              <AppButton
                full
                text={isTrader ? "Terminal" : "Stake LP"}
                onClick={onInvest}
                size="x-small"
                disabled={!canInvest}
                color={canInvest ? "primary" : "secondary"}
              />
            )}
          </SharedS.Body>

          {!isDesktop && (
            <S.DescriptionWrp>
              <ReadMore
                content={
                  description.length > 0
                    ? description
                    : "No description provided to proposal"
                }
                maxLen={description.length > 0 ? 10 : 100}
              />
            </S.DescriptionWrp>
          )}

          {showFooter && (
            <SharedS.Footer>
              {!isTrader && (
                <>
                  <Flex
                    full
                    data-tip
                    data-for={`risky-proposal-trader-info-${proposalId}-${poolAddress}`}
                    onMouseEnter={() => showTooltip(true)}
                    onMouseLeave={() => {
                      showTooltip(false)
                      setTimeout(() => showTooltip(true), 50)
                    }}
                  >
                    <Flex>
                      {!isDesktop && (
                        <SharedS.FundIconContainer>
                          <Icon
                            size={24}
                            m="0"
                            source={
                              poolMetadata?.assets[
                                poolMetadata?.assets.length - 1
                              ]
                            }
                            address={poolAddress}
                          />
                          {tooltip && (
                            <TraderInfoBadge
                              id={`risky-proposal-trader-info-${proposalId}-${poolAddress}`}
                              content="This is more than the average investment at risk proposals. Check on xxxxx what kind of token it is before trusting it."
                            />
                          )}
                        </SharedS.FundIconContainer>
                      )}
                      {TraderSizeView}
                    </Flex>
                  </Flex>
                  {!isDesktop && (
                    <ExternalLink color="#2680EB" href={proposalTokenLink}>
                      Сheck token
                    </ExternalLink>
                  )}
                </>
              )}

              {isDesktop && (
                <>
                  <AppButton
                    full
                    text={isTrader ? "Terminal" : "Stake LP"}
                    onClick={onInvest}
                    size="small"
                    disabled={!canInvest}
                    color={"tertiary"}
                  />
                  {isTrader && (
                    <S.RiskyProposalCardSettingsButton
                      full
                      text={"Settings"}
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      size="small"
                      color={"default"}
                    />
                  )}
                </>
              )}
            </SharedS.Footer>
          )}
        </SharedS.Card>
        {isDesktop && (
          <S.DescriptionWrp>
            <IconCommon name={ICON_NAMES.fileDock} />
            <ReadMore
              content={
                description.length > 0
                  ? description
                  : "No description provided to proposal"
              }
              maxLen={140}
            />
          </S.DescriptionWrp>
        )}
      </SharedS.Root>
      {isSettingsOpen && (
        <RiskyCardSettings
          visible={isSettingsOpen}
          setVisible={setIsSettingsOpen}
          timestamp={expirationDate.initial}
          maxSizeLP={maxSizeLP}
          maxInvestPrice={maxInvestPrice.value}
          proposalPool={proposalPool}
          fullness={fullness.value}
          currentPrice={currentPrice}
          proposalId={proposalId}
          successCallback={onUpdateRestrictions}
          proposalSymbol={proposalToken?.symbol}
          poolAddress={poolAddress}
        />
      )}
    </S.Root>
  )
}

export default RiskyProposalCard
