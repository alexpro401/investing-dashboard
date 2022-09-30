import {
  MouseEvent,
  FC,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react"
import { format } from "date-fns"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"

import { PriceFeed } from "abi"
import { ZERO } from "constants/index"
import { useActiveWeb3React } from "hooks"
import useContract from "hooks/useContract"
import { useERC20Data } from "state/erc20/hooks"
import { DATE_TIME_FORMAT } from "constants/time"
import { percentageOfBignumbers } from "utils/formulas"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { expandTimestamp, normalizeBigNumber } from "utils"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { ProposalsResponse } from "interfaces/abi-typings/TraderPoolRiskyProposal"
import { selectPriceFeedAddress } from "state/contracts/selectors"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import { Flex } from "theme"
import Icon from "components/Icon"
import Tooltip from "components/Tooltip"
import TokenIcon from "components/TokenIcon"
import IconButton from "components/IconButton"
import ExternalLink from "components/ExternalLink"
import Button, { SecondaryButton } from "components/Button"

import S, { TraderRating, TraderLPSize, TraderInfoBadge } from "./styled"
import RiskyCardSettings from "./Settings"
import SharedS, { BodyItem } from "components/cards/proposal/styled"

import settingsIcon from "assets/icons/settings.svg"
import settingsGreenIcon from "assets/icons/settings-green.svg"
import useTokenRating from "hooks/useTokenRating"
import { TraderPoolRiskyProposalType } from "interfaces/abi-typings"

const MAX_INVESTORS_COUNT = 1000

interface Props {
  proposal: ProposalsResponse
  proposalId: number
  poolAddress: string
  proposalPool: TraderPoolRiskyProposalType
  isTrader: boolean
  poolInfo: IPoolInfo
}

const RiskyProposalCard: FC<Props> = ({
  proposal,
  proposalId,
  poolAddress,
  proposalPool,
  poolInfo,
  isTrader,
}) => {
  const navigate = useNavigate()
  const { account, chainId } = useActiveWeb3React()
  const [proposalToken] = useERC20Data(proposal.proposalInfo.token)
  const priceFeedAddress = useSelector(selectPriceFeedAddress)
  const priceFeed = useContract(priceFeedAddress, PriceFeed)
  const getTokenRating = useTokenRating()

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const [tooltip, showTooltip] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)

  const [markPriceOpen, setMarkPriceOpen] = useState(ZERO)
  const [yourSizeLP, setYourSizeLP] = useState<BigNumber>(ZERO)
  const [traderSizeLP, setTraderSizeLP] = useState<BigNumber>(ZERO)

  const [tokenRating, setTokenRating] = useState<number>(0)

  /**
   * Date of proposal expiration
   * @returns value - expiration date
   * @returns completed - true if expiration date greater that current
   * @returns initial - expiration date in short format
   */
  const [expirationDate, setExpirationDate] = useState<{
    value: string
    completed: boolean
    initial: BigNumber
  }>({
    value: "0",
    completed: false,
    initial: ZERO,
  })

  /**
   * Proposal limit in LP's
   */
  const [maxSizeLP, setMaxSizeLP] = useState<{
    value: BigNumber
    normalized: string
  }>({ value: ZERO, normalized: "0" })

  /**
   * Maximum price of proposal token
   * @returns value - maximum price
   * @returns completed - true if positionTokenPrice >= maxTokenPriceLimit
   * @returns initial - maximum price in BigNumber
   */
  const [maxInvestPrice, setMaxInvestPrice] = useState<{
    value: string
    completed: boolean
    initial: BigNumber
  }>({ value: "0", completed: false, initial: ZERO })

  /**
   * Symbol of proposal
   */
  const proposalSymbol = useMemo<string>(() => {
    if (!proposalToken || !proposalToken.symbol) return ""
    return proposalToken.symbol
  }, [proposalToken])

  /**
   * Proposal fullness in LP's
   * @returns value - fullness
   * @returns completed - true if lpLocked >= investLPLimit
   * @returns initial - fullness in BigNumber
   */
  const fullness = useMemo<{
    value: string
    completed: boolean
    initial: BigNumber
  }>(() => {
    if (
      !proposal?.proposalInfo?.proposalLimits?.investLPLimit ||
      !proposal.proposalInfo.lpLocked
    ) {
      return { value: "0", completed: false, initial: ZERO }
    }

    const { lpLocked, proposalLimits } = proposal.proposalInfo

    return {
      value: normalizeBigNumber(lpLocked, 18, 6),
      completed: lpLocked.gte(proposalLimits.investLPLimit),
      initial: lpLocked,
    }
  }, [proposal])

  /**
   * Exact price on 1 position token in base tokens
   */
  const currentPrice = useMemo<{ value: string; initial: BigNumber }>(() => {
    if (!markPriceOpen) {
      return { value: "0", initial: ZERO }
    }

    return {
      value: normalizeBigNumber(markPriceOpen, 18, 2),
      initial: markPriceOpen,
    }
  }, [markPriceOpen])

  /**
   * Count of investors
   * @returns value - count of investors
   * @returns completed - true if investors count equal MAX_INVESTORS_COUNT
   */
  const investors = useMemo<{ value: string; completed: boolean }>(() => {
    if (!proposal || !proposal?.totalInvestors) {
      return { value: "0", completed: false }
    }

    const result = proposal.totalInvestors.toString()

    return { value: result, completed: Number(result) === MAX_INVESTORS_COUNT }
  }, [proposal])

  /**
   * Position current balance
   */
  const positionSize = useMemo<string>(() => {
    if (!proposal || !proposal?.proposalInfo.balancePosition) {
      return "0"
    }

    return normalizeBigNumber(proposal.proposalInfo.balancePosition, 18, 6)
  }, [proposal])

  /**
   * Trader LP's size in %
   */
  const traderSizePercentage = useMemo(() => {
    if (maxSizeLP.value.isZero() || !traderSizeLP || traderSizeLP.isZero()) {
      return ZERO
    }

    return percentageOfBignumbers(traderSizeLP, maxSizeLP.value)
  }, [maxSizeLP, traderSizeLP])

  /**
   * Indicating that proposal open or closed for investment (respectively true or false)
   */
  const canInvest = useMemo<boolean>(() => {
    return !expirationDate.completed && !maxInvestPrice.completed
  }, [expirationDate.completed, maxInvestPrice.completed])

  // Set expiration date
  useEffect(() => {
    if (!proposal || !proposal?.proposalInfo.proposalLimits.timestampLimit) {
      return
    }

    const { timestampLimit } = proposal.proposalInfo.proposalLimits

    const expandedTimestampLimit = expandTimestamp(
      Number(timestampLimit.toString())
    )
    const currentTimestamp = new Date().valueOf()

    setExpirationDate({
      value: format(expandedTimestampLimit, DATE_TIME_FORMAT),
      completed: currentTimestamp - expandedTimestampLimit >= 0,
      initial: timestampLimit,
    })
  }, [proposal])

  // Set investing limit
  useEffect(() => {
    if (!proposal || !proposal?.proposalInfo.proposalLimits.investLPLimit) {
      return
    }

    const { investLPLimit } = proposal.proposalInfo.proposalLimits

    setMaxSizeLP({
      value: investLPLimit,
      normalized: normalizeBigNumber(investLPLimit, 18, 6),
    })
  }, [proposal])

  // Set maximum invest price
  useEffect(() => {
    if (
      !proposal ||
      !proposal?.proposalInfo.proposalLimits.maxTokenPriceLimit
    ) {
      return
    }

    const {
      positionTokenPrice,
      proposalInfo: { proposalLimits },
    } = proposal

    setMaxInvestPrice({
      value: normalizeBigNumber(proposalLimits.maxTokenPriceLimit, 18, 2),
      completed: positionTokenPrice.gte(proposalLimits.maxTokenPriceLimit),
      initial: proposalLimits.maxTokenPriceLimit,
    })
  }, [proposal])

  // Fetch current user locked funds in proposal
  useEffect(() => {
    if (!proposalPool || proposalId === undefined || !account) return
    ;(async () => {
      try {
        const balance = await proposalPool.getActiveInvestmentsInfo(
          account,
          proposalId,
          1
        )
        if (balance && balance[0]) {
          setYourSizeLP(balance[0].lpInvested)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [account, proposalId, proposalPool])

  // Fetch trader locked funds in proposal
  useEffect(() => {
    if (!proposalPool || !poolInfo || proposalId === undefined) {
      return
    }

    ;(async () => {
      try {
        const balance = await proposalPool.getActiveInvestmentsInfo(
          poolInfo.parameters.trader,
          proposalId,
          1
        )

        if (balance && balance[0]) {
          setTraderSizeLP(balance[0].lpInvested)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [poolInfo, proposalId, proposalPool])

  // Fetch mark price from priceFeed when proposal is open
  useEffect(() => {
    if (!priceFeed || !proposalToken) return
    ;(async () => {
      try {
        const amount = parseUnits("1", 18)
        const price = await priceFeed.getNormalizedPriceOutUSD(
          proposalToken.address,
          amount.toHexString()
        )
        if (price && price.amountOut) {
          setMarkPriceOpen(price.amountOut)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [priceFeed, proposalToken])

  // Fetch token rating
  useEffect(() => {
    if (!chainId || !proposal) return
    ;(async () => {
      try {
        const rating = await getTokenRating(
          chainId,
          proposal.proposalInfo.token
        )
        setTokenRating(rating)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [chainId, proposal, getTokenRating])

  /**
   * Navigate to pool page
   * @param e - click event
   */
  const navigateToPool = useCallback(
    (e: MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      navigate(`/pool/profile/BASIC_POOL/${poolAddress}`)
    },
    [navigate, poolAddress]
  )

  /**
   * Navigate to risky invest terminal
   * @param e - click event
   */
  const onAddMore = useCallback(
    (e: MouseEvent<HTMLElement>): void => {
      e.stopPropagation()
      navigate(`/invest-risky-proposal/${poolAddress}/${proposalId}`)
    },
    [navigate, poolAddress, proposalId]
  )

  /**
   * Navigate to risky invest terminal
   * @param e - click event
   */
  const onInvest = useCallback(
    (e?: MouseEvent<HTMLButtonElement | MouseEvent>): void => {
      if (e) e.stopPropagation()
      if (isTrader) {
        navigate(`/swap-risky-proposal/${poolAddress}/${proposalId}/deposit`)
      } else {
        navigate(`/invest-risky-proposal/${poolAddress}/${proposalId}`)
      }
    },
    [navigate, poolAddress, proposalId, isTrader]
  )

  const onUpdateRestrictions = (
    timestamp: number,
    maxSize: BigNumber,
    maxInvest: BigNumber
  ) => {
    if (timestamp) {
      const expanded = expandTimestamp(timestamp)
      const currentTimestamp = new Date().valueOf()

      setExpirationDate({
        value: format(expanded, DATE_TIME_FORMAT),
        completed: currentTimestamp - expanded >= 0,
        initial: BigNumber.from(String(timestamp)),
      })
    }

    if (maxSize) {
      setMaxSizeLP({
        value: maxSize,
        normalized: normalizeBigNumber(maxSize, 18, 6),
      })
    }

    if (maxInvest) {
      const { positionTokenPrice } = proposal

      setMaxInvestPrice({
        value: normalizeBigNumber(maxInvest, 18, 2),
        completed: positionTokenPrice.gte(maxInvest),
        initial: maxInvest,
      })
    }
  }

  const InvestButton = canInvest ? (
    <Button full size="small" br="12px" onClick={onInvest}>
      {isTrader ? "Terminal" : "Stake LP"}
    </Button>
  ) : (
    <SecondaryButton full size="small" br="12px">
      {isTrader ? "Terminal" : "Stake LP"}
    </SecondaryButton>
  )

  return (
    <>
      <SharedS.Card>
        <SharedS.Head p={isTrader ? "8px 8px 7px 16px" : undefined}>
          <Flex>
            <TokenIcon address={proposal.proposalInfo.token} m="0" size={24} />

            {isTrader ? (
              <SharedS.Title>{proposalSymbol}</SharedS.Title>
            ) : (
              <Flex ai="center">
                <SharedS.Title>{proposalSymbol}</SharedS.Title>
                <TraderRating rating={tokenRating} />
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
              </>
            ) : (
              <Flex onClick={navigateToPool}>
                <S.Ticker>{poolInfo?.ticker ?? ""}</S.Ticker>
                <TokenIcon
                  address={poolInfo?.parameters.baseToken}
                  m="0 0 0 4px"
                  size={24}
                />
              </Flex>
            )}
          </Flex>
          {isSettingsOpen && (
            <RiskyCardSettings
              visible={isSettingsOpen}
              setVisible={setIsSettingsOpen}
              timestamp={expirationDate.initial}
              maxSizeLP={maxSizeLP.value}
              maxInvestPrice={maxInvestPrice.initial}
              proposalPool={proposalPool}
              fullness={fullness.initial}
              currentPrice={currentPrice.initial}
              proposalId={proposalId}
              successCallback={onUpdateRestrictions}
              proposalSymbol={proposalToken?.symbol}
              poolAddress={poolAddress}
            />
          )}
        </SharedS.Head>
        <SharedS.Body>
          <BodyItem
            label={isTrader ? "Max size (LP)" : "Proposal size LP"}
            amount={maxSizeLP.normalized}
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
            amount={fullness.value}
            completed={fullness.completed}
            ai="flex-end"
          />
          <BodyItem
            label={`Max. Invest Price (${proposalSymbol})`}
            amount={maxInvestPrice.value}
            completed={maxInvestPrice.completed}
          />
          <BodyItem
            label={`Current price (${proposalSymbol})`}
            amount={currentPrice.value}
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
          <Flex full>{InvestButton}</Flex>
        </SharedS.Body>

        {!isTrader && (
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
              {chainId && (
                <ExternalLink
                  color="#2680EB"
                  href={getExplorerLink(
                    chainId,
                    proposal.proposalInfo.token,
                    ExplorerDataType.ADDRESS
                  )}
                >
                  Сheck token
                </ExternalLink>
              )}
            </div>
          </SharedS.Footer>
        )}
      </SharedS.Card>
    </>
  )
}

export default RiskyProposalCard
