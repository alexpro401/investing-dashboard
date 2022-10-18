import { FC, MouseEvent, useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

import { Flex } from "theme"
import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import VestCard from "components/cards/Vest"
import { accordionSummaryVariants } from "motion/variants"
import SharedS, { BodyItem, Share } from "components/cards/position/styled"
import S from "./styled"

import useRiskyPosition from "./useRiskyPosition"
import { InvestorRiskyPositionWithVests } from "interfaces/thegraphs/investors"

interface InvestorRiskyPositionProposalData {
  token: string
  pool: {
    id: string
    baseToken: string
  }
}

interface Props {
  position: InvestorRiskyPositionWithVests & InvestorRiskyPositionProposalData
  poolInfo: IPoolInfo
  poolMetadata: any
  proposalId: string
}

const RiskyInvestorPositionCard: FC<Props> = ({
  position,
  poolInfo,
  poolMetadata,
  proposalId,
}) => {
  const navigate = useNavigate()

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
  ] = useRiskyPosition(position, proposalId)

  const vests = position.vests ?? []

  const [showVests, setShowVests] = useState<boolean>(false)
  const toggleVests = useCallback(() => {
    setShowVests(!showVests)
  }, [showVests])

  const positionTokenSymbol = useMemo(() => {
    if (!positionToken || !positionToken?.symbol) return ""

    return positionToken.symbol
  }, [positionToken])

  const baseTokenSymbol = useMemo(() => {
    if (!baseToken || !baseToken?.symbol) return ""

    return baseToken.symbol
  }, [baseToken])

  /**
   * Navigate to pool page
   * @param e - click event
   */
  const navigateToPool = useCallback(
    (e: MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      navigate(`/pool/profile/BASIC_POOL/${position.pool.id}`)
    },
    [navigate, position]
  )

  /**
   * Share closed position to social networks
   * @param e - click event
   */
  const onShare = useCallback((e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation()
    console.log("On share")
  }, [])

  return (
    <>
      <SharedS.Container>
        <SharedS.Card onClick={toggleVests}>
          <SharedS.Head>
            <Flex>
              <S.Symbols>
                <S.SymbolItem>
                  <TokenIcon address={positionToken?.address} m="0" size={24} />
                </S.SymbolItem>
                <S.SymbolItem>
                  <TokenIcon address={baseToken?.address} m="0" size={26} />
                </S.SymbolItem>
              </S.Symbols>
              <>
                {!position.isClosed ? (
                  <>
                    <S.Amount>{positionVolume.format}</S.Amount>
                    <S.PositionSymbol>LP2</S.PositionSymbol>
                  </>
                ) : (
                  <>
                    <S.PositionSymbol>{positionTokenSymbol}</S.PositionSymbol>
                    <S.FundSymbol>/{baseTokenSymbol}</S.FundSymbol>
                  </>
                )}
                <SharedS.PNL value={pnlPercentage.format}>
                  {pnlPercentage.format}%
                </SharedS.PNL>
                {position.isClosed && <Share onClick={onShare} />}
              </>
            </Flex>
            <Flex m={position.isClosed ? "0 -8px 0 0" : ""}>
              <Flex onClick={navigateToPool}>
                <S.FundSymbol>{poolInfo?.ticker}</S.FundSymbol>
                <Icon
                  m="0"
                  size={26}
                  source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
                  address={position.pool.id}
                />
              </Flex>
            </Flex>
          </SharedS.Head>
          <SharedS.Body>
            <BodyItem
              label={`Entry Price ${baseTokenSymbol}`}
              amount={entryPriceBase}
              amountUSD={entryPriceUSD}
            />
            <BodyItem
              label={
                (position.isClosed ? "Closed price " : "Current price ") +
                baseTokenSymbol
              }
              amount={markPriceBase}
              amountUSD={markPriceUSD}
            />
            <BodyItem
              label={`P&L ${baseTokenSymbol}`}
              amount={pnlBase}
              pnl={pnlPercentage.big}
              amountUSD={pnlUSD}
              ai="flex-end"
            />
          </SharedS.Body>
        </SharedS.Card>

        <SharedS.ExtraItem
          initial="hidden"
          animate={showVests ? "visible" : "hidden"}
          variants={accordionSummaryVariants}
        >
          {vests && vests.length ? (
            <SharedS.TradesList>
              {vests.map((e) => (
                <VestCard
                  data={e}
                  key={e.hash}
                  baseTokenSymbol={baseTokenSymbol}
                />
              ))}
            </SharedS.TradesList>
          ) : (
            <Flex full jc="center" p="12px 0">
              <SharedS.WitoutData>No trades</SharedS.WitoutData>
            </Flex>
          )}
        </SharedS.ExtraItem>
      </SharedS.Container>
    </>
  )
}

export default RiskyInvestorPositionCard
