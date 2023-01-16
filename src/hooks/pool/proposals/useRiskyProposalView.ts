import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { generatePath, useNavigate } from "react-router-dom"
import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"

import { IRiskyProposalInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"
import { TraderPoolRiskyProposal } from "interfaces/typechain"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { useActiveWeb3React } from "hooks"
import { useERC20Data } from "state/erc20/hooks"
import { usePriceFeedContract } from "contracts"
import useTokenRating from "hooks/useTokenRating"
import { DATE_TIME_FORMAT, ROUTE_PATHS, ZERO } from "consts"
import { expandTimestamp, normalizeBigNumber } from "utils"
import { percentageOfBignumbers } from "utils/formulas"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { Token } from "interfaces"

interface Props {
  proposal: IRiskyProposalInfo[0]
  proposalId: number
  poolAddress: string
  proposalPool: TraderPoolRiskyProposal
  isTrader: boolean
  poolInfo: IPoolInfo
}

type UseRiskyProposalViewResponseValues = {
  proposalSymbol: string
  tokenRating: number
  canInvest: boolean
  proposalTokenLink: string
  maxSizeLP: BigNumber
  yourSizeLP: BigNumber
  fullness: {
    value: BigNumber
    completed: boolean
  }
  maxInvestPrice: {
    value: BigNumber
    completed: boolean
  }
  currentPrice: BigNumber
  expirationDate: {
    value: string
    completed: boolean
    initial: BigNumber
  }
  investors: { value: string; completed: boolean }
  positionSize: string
  traderSizeLP: BigNumber
  traderSizePercentage: BigNumber
  proposalToken: Token | null
}
type UseRiskyProposalViewResponseMethods = {
  navigateToPool
  onAddMore
  onInvest
  onUpdateRestrictions
}

type UseRiskyProposalViewResponse = [
  UseRiskyProposalViewResponseValues,
  UseRiskyProposalViewResponseMethods
]
export const useRiskyProposalView = (
  funcArgs: Props
): UseRiskyProposalViewResponse => {
  const {
    proposal,
    proposalId,
    poolAddress,
    proposalPool,
    poolInfo,
    isTrader,
  } = funcArgs

  const navigate = useNavigate()
  const { account, chainId } = useActiveWeb3React()
  const [proposalToken] = useERC20Data(proposal.proposalInfo.token)
  const priceFeed = usePriceFeedContract()
  const getTokenRating = useTokenRating()

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
  const [maxSizeLP, setMaxSizeLP] = useState<BigNumber>(ZERO)

  /**
   * Maximum price of proposal token
   * @returns value - maximum price
   * @returns completed - true if positionTokenPrice >= maxTokenPriceLimit
   * @returns initial - maximum price in BigNumber
   */
  const [maxInvestPrice, setMaxInvestPrice] = useState<{
    value: BigNumber
    completed: boolean
  }>({ value: ZERO, completed: false })

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
    value: BigNumber
    completed: boolean
  }>(() => {
    if (
      !proposal?.proposalInfo?.proposalLimits?.investLPLimit ||
      !proposal.proposalInfo.lpLocked
    ) {
      return { value: ZERO, completed: false }
    }

    const { lpLocked, proposalLimits } = proposal.proposalInfo

    return {
      value: lpLocked,
      completed: lpLocked.gte(proposalLimits.investLPLimit),
    }
  }, [proposal])

  /**
   * Exact price on 1 position token in base tokens
   */
  const currentPrice = useMemo<BigNumber>(() => {
    if (!markPriceOpen) {
      return ZERO
    }

    return markPriceOpen
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

    return { value: result, completed: Number(result) === 1000 }
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
    if (maxSizeLP.isZero() || !traderSizeLP || traderSizeLP.isZero()) {
      return ZERO
    }

    return percentageOfBignumbers(traderSizeLP, maxSizeLP)
  }, [maxSizeLP, traderSizeLP])

  /**
   * Indicating that proposal open or closed for investment (respectively true or false)
   */
  const canInvest = useMemo<boolean>(() => {
    return !expirationDate.completed && !maxInvestPrice.completed
  }, [expirationDate.completed, maxInvestPrice.completed])

  const proposalTokenLink = useMemo<string>(() => {
    if (!chainId) return ""

    return getExplorerLink(
      chainId,
      proposal.proposalInfo.token,
      ExplorerDataType.ADDRESS
    )
  }, [chainId, proposal])

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

    setMaxSizeLP(investLPLimit)
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
      value: proposalLimits.maxTokenPriceLimit,
      completed: positionTokenPrice.gte(proposalLimits.maxTokenPriceLimit),
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
      navigate(
        generatePath(ROUTE_PATHS.poolProfile, {
          poolAddress: poolAddress,
        })
      )
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
      setMaxSizeLP(maxSize)
    }

    if (maxInvest) {
      const { positionTokenPrice } = proposal

      setMaxInvestPrice({
        value: maxInvest,
        completed: positionTokenPrice.gte(maxInvest),
      })
    }
  }

  return [
    {
      proposalSymbol,
      tokenRating,
      canInvest,
      proposalTokenLink,
      maxSizeLP,
      yourSizeLP,
      fullness,
      maxInvestPrice,
      currentPrice,
      expirationDate,
      investors,
      positionSize,
      traderSizeLP,
      traderSizePercentage,
      proposalToken,
    },
    { navigateToPool, onAddMore, onInvest, onUpdateRestrictions },
  ]
}
