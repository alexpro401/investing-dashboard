import { useWeb3React } from "@web3-react/core"
import { NoDataMessage } from "common"
import VestCard from "components/cards/Vest"
import Icon from "components/Icon"
import LoadMore from "components/LoadMore"
import TokenIcon from "components/TokenIcon"
import { ICON_NAMES, MAX_PAGINATION_COUNT } from "consts"
import {
  useBreakpoints,
  useInvestorRiskyPositionVests,
  useInvestorRiskyPositionView,
} from "hooks"
import { WrappedInvestorRiskyPositionView } from "interfaces/thegraphs/investors"
import { isEmpty } from "lodash"
import { accordionSummaryVariants } from "motion/variants"
import * as React from "react"
import { SpiralSpinner } from "react-spinners-kit"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { normalizeBigNumber } from "utils"
import * as S from "./styled"

interface Props {
  payload: WrappedInvestorRiskyPositionView
}

const CardInvestorRiskyPosition: React.FC<Props> = ({ payload }) => {
  const { id: positionId, position, poolInfo, utilityIds } = payload

  const { account } = useWeb3React()
  const [{ poolMetadata }] = usePoolMetadata(
    utilityIds.poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const riskyProposalView = useInvestorRiskyPositionView(position, utilityIds)
  const [
    {
      positionVolume,
      entryPriceBase,
      entryPriceUSD,
      markPriceBase,
      markPriceUSD,
      pnlPercentage,
      pnlBase,
      pnlUSD,
      positionToken,
      baseToken,
    },
  ] = riskyProposalView

  const [showVests, setShowVests] = React.useState<boolean>(false)
  const toggleVests = React.useCallback(() => {
    setShowVests((prev) => !prev)
  }, [])

  const baseTokenSymbol = React.useMemo(
    () => baseToken?.symbol ?? "",
    [baseToken]
  )

  const positionTokenSymbol = React.useMemo(
    () => positionToken?.symbol ?? "",
    [positionToken]
  )

  const riskyPositionVestsVariables = React.useMemo(
    () => ({ riskyPositionId: positionId, investorAddress: account }),
    [positionId, account]
  )
  const [{ data: vests, loading: loadingVests }, fetchMoreVests, resetVests] =
    useInvestorRiskyPositionVests(riskyPositionVestsVariables, !showVests)

  React.useEffect(() => {
    if (!showVests) {
      resetVests()
    }
  }, [showVests, resetVests])

  const { isDesktop } = useBreakpoints()

  return (
    <S.Root>
      <S.CardInvestorRiskyPositionBody
        onClick={toggleVests}
        isSharpBorders={showVests}
      >
        <S.CardInvestorRiskyPositionBodyItemTokensWrp gridEnd={2}>
          <S.CardInvestorRiskyPositionTokensWrp>
            <S.CardInvestorRiskyPositionTokensIconsWrp>
              <S.CardInvestorRiskyPositionTokensIconPool>
                <TokenIcon address={positionToken?.address} m="0" size={24} />
              </S.CardInvestorRiskyPositionTokensIconPool>
              <S.CardInvestorRiskyPositionTokensIconProposal>
                <TokenIcon address={baseToken?.address} m="0" size={26} />
              </S.CardInvestorRiskyPositionTokensIconProposal>
            </S.CardInvestorRiskyPositionTokensIconsWrp>
            <S.CardInvestorRiskyPositionSizeWrp>
              {position.isClosed ? (
                <S.CardInvestorRiskyPositionBodyItemAmount>
                  {normalizeBigNumber(positionVolume, 18, 6)} LP2
                </S.CardInvestorRiskyPositionBodyItemAmount>
              ) : (
                <S.CardInvestorRiskyPositionTokenNamesWrp>
                  <S.CardInvestorRiskyPositionTokenNameProposal>
                    {positionTokenSymbol}
                  </S.CardInvestorRiskyPositionTokenNameProposal>
                  <S.CardInvestorRiskyPositionTokenNamePool>
                    /{baseTokenSymbol}
                  </S.CardInvestorRiskyPositionTokenNamePool>
                </S.CardInvestorRiskyPositionTokenNamesWrp>
              )}
              <S.CardInvestorRiskyPositionPnlChip value={pnlPercentage.format}>
                {pnlPercentage.format}%
              </S.CardInvestorRiskyPositionPnlChip>
            </S.CardInvestorRiskyPositionSizeWrp>
          </S.CardInvestorRiskyPositionTokensWrp>
        </S.CardInvestorRiskyPositionBodyItemTokensWrp>

        <S.CardInvestorRiskyPositionBodyItemPoolInfoWrp textAlign={"end"}>
          <S.CardInvestorRiskyPositionPoolInfoWrp>
            <S.CardInvestorRiskyPositionPoolInfoName>
              {poolInfo?.ticker ?? ""}
            </S.CardInvestorRiskyPositionPoolInfoName>
            <Icon
              m="0"
              size={isDesktop ? 32 : 26}
              source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
              address={utilityIds.poolAddress}
            />
          </S.CardInvestorRiskyPositionPoolInfoWrp>
        </S.CardInvestorRiskyPositionBodyItemPoolInfoWrp>

        <S.CardInvestorRiskyPositionDivider />

        <S.CardInvestorRiskyPositionBodyItemGrid>
          <S.CardInvestorRiskyPositionBodyItemLabel>
            Entry Price {baseTokenSymbol}
          </S.CardInvestorRiskyPositionBodyItemLabel>
          <S.CardInvestorRiskyPositionBodyItemAmount>
            {normalizeBigNumber(entryPriceBase, 18, 6)}
          </S.CardInvestorRiskyPositionBodyItemAmount>
          <S.CardInvestorRiskyPositionBodyItemPrice>
            {entryPriceUSD.isNegative() && "-"}$
            {normalizeBigNumber(entryPriceUSD.abs(), 18, 2)}
          </S.CardInvestorRiskyPositionBodyItemPrice>
        </S.CardInvestorRiskyPositionBodyItemGrid>

        <S.CardInvestorRiskyPositionBodyItemGrid>
          <S.CardInvestorRiskyPositionBodyItemLabel>
            {position.isClosed ? "Closed price " : "Current price "}
            {baseTokenSymbol}
          </S.CardInvestorRiskyPositionBodyItemLabel>
          <S.CardInvestorRiskyPositionBodyItemAmount>
            {normalizeBigNumber(markPriceBase, 18, 6)}
          </S.CardInvestorRiskyPositionBodyItemAmount>
          <S.CardInvestorRiskyPositionBodyItemPrice>
            {markPriceUSD.isNegative() && "-"}$
            {normalizeBigNumber(markPriceUSD.abs(), 18, 2)}
          </S.CardInvestorRiskyPositionBodyItemPrice>
        </S.CardInvestorRiskyPositionBodyItemGrid>

        <S.CardInvestorRiskyPositionBodyItemGrid textAlign={"end"}>
          <S.CardInvestorRiskyPositionBodyItemLabel>
            P&L {baseTokenSymbol}
          </S.CardInvestorRiskyPositionBodyItemLabel>
          <S.CardInvestorRiskyPositionBodyItemAmount>
            {normalizeBigNumber(pnlBase, 18, 6)}
          </S.CardInvestorRiskyPositionBodyItemAmount>
          <S.CardInvestorRiskyPositionBodyItemPrice>
            {pnlUSD.isNegative() && "-"}$
            {normalizeBigNumber(pnlUSD.abs(), 18, 2)}
          </S.CardInvestorRiskyPositionBodyItemPrice>
        </S.CardInvestorRiskyPositionBodyItemGrid>
        <S.CardInvestorRiskyPositionToggleWrp>
          <S.CardInvestorRiskyPositionToggleIconIndicator
            name={ICON_NAMES.angleDown}
            isActive={showVests}
          />
        </S.CardInvestorRiskyPositionToggleWrp>
      </S.CardInvestorRiskyPositionBody>
      <S.CardInvestorRiskyPositionExtra
        initial="hidden"
        animate={showVests ? "visible" : "hidden"}
        variants={accordionSummaryVariants}
      >
        <S.CardInvestorRiskyPositionVestsWrp>
          {isEmpty(vests) && loadingVests && (
            <S.CardInvestorRiskyPositionVestsLoaderWrp>
              <SpiralSpinner size={30} loading />
            </S.CardInvestorRiskyPositionVestsLoaderWrp>
          )}
          {isEmpty(vests) && !loadingVests && <NoDataMessage />}
          {!isEmpty(vests) ? (
            <>
              {vests.map((v) => (
                <VestCard
                  data={v}
                  key={v.id}
                  baseTokenSymbol={baseTokenSymbol}
                />
              ))}
              {vests.length >= MAX_PAGINATION_COUNT && (
                <LoadMore
                  isLoading={loadingVests && !!vests.length}
                  handleMore={fetchMoreVests}
                />
              )}
            </>
          ) : null}
        </S.CardInvestorRiskyPositionVestsWrp>
      </S.CardInvestorRiskyPositionExtra>
    </S.Root>
  )
}

export default CardInvestorRiskyPosition
