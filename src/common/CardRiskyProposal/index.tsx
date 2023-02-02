import * as React from "react"
import * as S from "./styled"

import { v4 as uuidv4 } from "uuid"

import { useBreakpoints, useRiskyProposalView } from "hooks"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { TraderPoolRiskyProposal } from "interfaces/typechain"
import { IRiskyProposalInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"
import { normalizeBigNumber } from "utils"

import TokenIcon from "components/TokenIcon"
import { AppButton, Icon as IconCommon } from "../index"
import { ICON_NAMES } from "../../consts"
import ReadMore from "../../components/ReadMore"

interface Props {
  proposal: IRiskyProposalInfo[0]
  proposalId: number
  poolAddress: string
  proposalPool: TraderPoolRiskyProposal
  isTrader: boolean
  poolInfo: IPoolInfo
}
const CardRiskyProposal: React.FC<Props> = (props) => {
  const {
    proposal,
    proposalId,
    poolAddress,
    proposalPool,
    isTrader,
    poolInfo,
  } = props

  const ipfsUrl = React.useMemo(
    () => poolInfo?.parameters.descriptionURL ?? "",
    [poolInfo]
  )
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
                {isDesktop && (
                  <S.CardRiskyProposalLabel>
                    {"Proposal token"}
                  </S.CardRiskyProposalLabel>
                )}
                <S.CardRiskyProposalValue>
                  {proposalSymbol}
                </S.CardRiskyProposalValue>
              </S.CardRiskyProposalTokenInfoWrp>
            </S.CardRiskyProposalTokenWrp>
          </S.CardRiskyProposalGridItemToken>

          {isTrader ? (
            <S.CardRiskyProposalGridItemSettingsAction>
              Settings
            </S.CardRiskyProposalGridItemSettingsAction>
          ) : (
            <S.CardRiskyProposalGridItemBaseToken>
              base token
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
                  {isTrader && (
                    <S.CardRiskyProposalInvestMoreButton
                      text={"+ Add"}
                      onClick={onAddMore}
                      size={"x-small"}
                      color={isDesktop ? "secondary" : "default"}
                    />
                  )}
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue>
                {normalizeBigNumber(yourSizeLP, 18, 6)}
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemCurrentUserSize>

          <S.CardRiskyProposalGridItemFullness>
            <S.CardRiskyProposalValueWrp alignment={"flex-end"}>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>{"Fullness (LP)"}</span>
                  {isDesktop && (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Fullness(LP) info"}
                    </S.CardRiskyProposalLabelTooltip>
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
                    {String("Max. Invest Price").concat(` (${proposalSymbol})`)}
                  </span>
                  {isDesktop && (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Max.Invest Price info"}
                    </S.CardRiskyProposalLabelTooltip>
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
                    {String("Current price").concat(` (${proposalSymbol})`)}
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
            <S.CardRiskyProposalValueWrp alignment={"flex-end"}>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>{"Expiration date"}</span>
                  {isDesktop && (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Expiration date info"}
                    </S.CardRiskyProposalLabelTooltip>
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
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue completed={investors.completed}>
                {investors.value} / 1000
              </S.CardRiskyProposalValue>
            </S.CardRiskyProposalValueWrp>
          </S.CardRiskyProposalGridItemInvestors>

          <S.CardRiskyProposalGridItemPositionSize>
            <S.CardRiskyProposalValueWrp>
              <S.CardRiskyProposalLabel>
                <S.CardRiskyProposalLabelContent>
                  <span>
                    {String("Position size").concat(` (${proposalSymbol})`)}
                  </span>
                  {isDesktop && (
                    <S.CardRiskyProposalLabelTooltip id={uuidv4()}>
                      {"Position size info"}
                    </S.CardRiskyProposalLabelTooltip>
                  )}
                </S.CardRiskyProposalLabelContent>
              </S.CardRiskyProposalLabel>
              <S.CardRiskyProposalValue>
                {positionSize}
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
              color={canInvest ? "primary" : "secondary"}
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
                TraderSize
              </S.CardRiskyProposalGridItemTraderSize>
              {!isDesktop && (
                <S.CardRiskyProposalGridItemCheckToken>
                  CheckToken
                </S.CardRiskyProposalGridItemCheckToken>
              )}
            </>
          )}
        </S.CardRiskyProposalGrid>
      </S.CardRiskyProposalBody>
    </S.Root>
  )
}

export default CardRiskyProposal
