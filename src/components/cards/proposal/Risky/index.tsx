import { FC, useState } from "react"
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
  RiskyCardSettings,
  TraderInfoBadge,
  TraderLPSize,
  Rating,
} from "./components"

import settingsIcon from "assets/icons/settings.svg"
import settingsGreenIcon from "assets/icons/settings-green.svg"
import { TraderPoolRiskyProposal } from "interfaces/typechain"
import { IRiskyProposalInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"
import { ICON_NAMES } from "consts"

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
    },
    { navigateToPool, onAddMore, onInvest, onUpdateRestrictions },
  ] = useRiskyProposalView(props)

  const { isDesktop } = useBreakpoints()
  const [tooltip, showTooltip] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)

  return (
    <>
      <SharedS.Card>
        {!isDesktop && (
          <SharedS.Head p={isTrader ? "8px 8px 7px 16px" : "8px 16px 7px 16px"}>
            <Flex>
              <TokenIcon
                address={proposal.proposalInfo.token}
                m="0"
                size={24}
              />

              {isTrader ? (
                <SharedS.Title>{proposalSymbol}</SharedS.Title>
              ) : (
                <Flex ai="center">
                  <SharedS.Title>{proposalSymbol}</SharedS.Title>
                  <Rating rating={tokenRating} />
                  <Flex m="0 0 -5px">
                    <Tooltip
                      id={`risky-proposal-rating-info-${proposalId}-${poolAddress}`}
                      size="small"
                    >
                      Risky proposal rating info
                    </Tooltip>
                  </Flex>
                </Flex>
              )}
            </Flex>

            <Flex>
              {isTrader ? (
                <>
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
                </>
              ) : (
                <Flex onClick={navigateToPool} gap={"4"}>
                  <S.Ticker>{poolInfo?.ticker ?? ""}</S.Ticker>
                  <TokenIcon
                    address={poolInfo?.parameters.baseToken}
                    m="0"
                    size={24}
                  />
                </Flex>
              )}
            </Flex>
          </SharedS.Head>
        )}
        <SharedS.Body>
          {isDesktop && (
            <Flex gap={"8"}>
              <TokenIcon
                address={proposal.proposalInfo.token}
                m="0"
                size={36}
              />
              <BodyItem
                label="Proposal token"
                amount={
                  <Flex ai="center" gap={"8"}>
                    <ExternalLink
                      color={theme.textColors.primary}
                      href={proposalTokenLink}
                      fz={"16px"}
                      fw={"700"}
                    >
                      {proposalSymbol}
                    </ExternalLink>

                    <Rating rating={tokenRating} />
                  </Flex>
                }
              />
            </Flex>
          )}
          <BodyItem
            label={isTrader ? "Max size (LP)" : "Proposal size LP"}
            amount={normalizeBigNumber(maxSizeLP, 18, 6)}
          />
          <BodyItem
            label={
              <Flex>
                <span>Your size (LP)</span>
                {isTrader && (
                  <S.AddButton onClick={onAddMore}>+ Add</S.AddButton>
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
          {isDesktop && !isTrader && (
            <BodyItem
              label={"Trader size"}
              amount={
                <Flex gap={"4"} ai={"center"}>
                  <IconCommon name={ICON_NAMES.warnCircledFilled} />
                  <span>{normalizeBigNumber(traderSizeLP, 18, 2)}</span>
                  <span>
                    ({normalizeBigNumber(traderSizePercentage, 18, 2)}%)
                  </span>
                </Flex>
              }
            />
          )}
          {isDesktop && (
            <>
              {isTrader ? (
                <Flex>
                  <S.Status active={canInvest}>
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
                <Flex gap={"8"}>
                  <TokenIcon
                    address={poolInfo?.parameters.baseToken}
                    m="0"
                    size={isDesktop ? 36 : 24}
                  />
                  <BodyItem
                    label="Fund ticker"
                    amount={poolInfo?.ticker ?? ""}
                  />
                </Flex>
              )}
            </>
          )}
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
              onClick={() => onInvest}
              size="x-small"
              disabled={!canInvest}
              color={canInvest ? "primary" : "secondary"}
            />
          )}

          {isDesktop && !isTrader && (
            <AppButton
              full
              text={"Stake LP"}
              onClick={() => onInvest}
              size="small"
              disabled={!canInvest}
              color={canInvest ? "primary" : "secondary"}
            />
          )}
        </SharedS.Body>

        {!isDesktop && !isTrader && (
          <SharedS.Footer>
            <Flex
              data-tip
              data-for={`risky-proposal-trader-info-${proposalId}-${poolAddress}`}
              onMouseEnter={() => showTooltip(true)}
              onMouseLeave={() => {
                showTooltip(false)
                setTimeout(() => showTooltip(true), 50)
              }}
            >
              <SharedS.FundIconContainer>
                <Icon
                  size={24}
                  m="0"
                  source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
                  address={poolAddress}
                />
                {tooltip && (
                  <TraderInfoBadge
                    id={`risky-proposal-trader-info-${proposalId}-${poolAddress}`}
                    content="This is more than the average investment at risk proposals. Check on xxxxx what kind of token it is before trusting it."
                  />
                )}
              </SharedS.FundIconContainer>
              <Flex dir="column" ai="flex-start" m="0 0 0 4px">
                <SharedS.SizeTitle>
                  Trader size: {normalizeBigNumber(traderSizeLP, 18, 2)} LP (
                  {normalizeBigNumber(traderSizePercentage, 18, 2)}%)
                </SharedS.SizeTitle>
                <SharedS.LPSizeContainer>
                  <TraderLPSize
                    size={Number(
                      normalizeBigNumber(traderSizePercentage, 18, 2)
                    )}
                  />
                </SharedS.LPSizeContainer>
              </Flex>
            </Flex>
            <div>
              <ExternalLink color="#2680EB" href={proposalTokenLink}>
                Сheck token
              </ExternalLink>
            </div>
          </SharedS.Footer>
        )}
      </SharedS.Card>
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
    </>
  )
}

export default RiskyProposalCard
