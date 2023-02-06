import { useCallback, useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"
import { isEmpty } from "lodash"

import { TraderPoolRiskyProposal } from "interfaces/typechain"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { useActiveWeb3React, useContract, usePoolContract } from "hooks"
import { useERC20Data } from "state/erc20/hooks"
import { useCorePropertiesContract, usePriceFeedContract } from "contracts"
import useTokenRating from "hooks/useTokenRating"
import { DATE_TIME_FORMAT, ZERO } from "consts"
import { expandTimestamp } from "utils"
import { percentageOfBignumbers } from "utils/formulas"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { Token } from "interfaces"
import { IpfsEntity } from "utils/ipfsEntity"
import * as React from "react"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { WrappedRiskyProposalView } from "types"
import { TraderPoolRiskyProposal as TraderPoolRiskyProposal_ABI } from "abi"

type UseRiskyProposalViewResponseValues = {
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
  investors: { value: BigNumber; completed: boolean }
  positionSize: BigNumber
  traderSizeLP: BigNumber
  traderSizePercentage: BigNumber
  proposalToken: Token | null
  description: string
  maximumPoolInvestors: BigNumber
  isTrader: boolean
  proposalContract: TraderPoolRiskyProposal | null
  poolInfo: IPoolInfo | null
  poolMetadata: any
}
type UseRiskyProposalViewResponseMethods = {
  onUpdateRestrictions
}

type UseRiskyProposalViewResponse = [
  UseRiskyProposalViewResponseValues,
  UseRiskyProposalViewResponseMethods
]
export const useRiskyProposalView = (
  funcArgs: WrappedRiskyProposalView
): UseRiskyProposalViewResponse => {
  const { proposal, utilityIds } = funcArgs
  const {
    proposalId,
    basicPoolAddress: poolAddress,
    proposalContractAddress,
  } = utilityIds

  const { account, chainId } = useActiveWeb3React()
  const [proposalToken] = useERC20Data(proposal.proposalInfo.token)
  const [, poolInfo] = usePoolContract(poolAddress)
  const priceFeed = usePriceFeedContract()
  const getTokenRating = useTokenRating()
  const corePropertiesContract = useCorePropertiesContract()
  const proposalContract = useContract<TraderPoolRiskyProposal>(
    proposalContractAddress,
    TraderPoolRiskyProposal_ABI
  )

  const ipfsUrl = React.useMemo(
    () => poolInfo?.parameters.descriptionURL ?? "",
    [poolInfo]
  )
  const [{ poolMetadata }] = usePoolMetadata(poolAddress, ipfsUrl)

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) return false
    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  const [markPriceOpen, setMarkPriceOpen] = useState(ZERO)
  const [yourSizeLP, setYourSizeLP] = useState<BigNumber>(ZERO)
  const [traderSizeLP, setTraderSizeLP] = useState<BigNumber>(ZERO)
  const [tokenRating, setTokenRating] = useState<number>(0)
  const [description, setDescription] = useState<string>("")
  const [maximumPoolInvestors, setMaximumPoolInvestors] =
    useState<BigNumber>(ZERO)

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
  const investors = useMemo<{ value: BigNumber; completed: boolean }>(() => {
    if (
      !proposal ||
      !proposal?.totalInvestors ||
      maximumPoolInvestors.isZero()
    ) {
      return { value: ZERO, completed: false }
    }

    return {
      value: proposal.totalInvestors,
      completed: BigNumber.from(proposal.totalInvestors).eq(
        maximumPoolInvestors
      ),
    }
  }, [proposal, maximumPoolInvestors])

  /**
   * Position current balance
   */
  const positionSize = useMemo<BigNumber>(
    () => proposal?.proposalInfo.balancePosition,
    [proposal]
  )

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

  const loadDetailsFromIpfs = useCallback(async () => {
    if (!proposal || isEmpty(proposal.proposalInfo.descriptionURL)) return
    try {
      const riskyProposalIpfsEntity = new IpfsEntity<string>({
        path: proposal.proposalInfo.descriptionURL,
      })

      const _description = await riskyProposalIpfsEntity.load()

      setDescription(_description)
    } catch (e) {
      console.error("Failed to load description")
    }
  }, [proposal])

  const loadMaxPoolInvestors = useCallback(async () => {
    if (!corePropertiesContract) return
    try {
      const _maximumPoolInvestors =
        await corePropertiesContract.getMaximumPoolInvestors()

      setMaximumPoolInvestors(_maximumPoolInvestors)
    } catch (e) {
      console.error("Failed to load maximum pool investors")
    }
  }, [corePropertiesContract])

  const loadUserActiveInvestmentsInfo = useCallback(async () => {
    if (!account || !proposalContract) return
    try {
      const _userActiveInvestmentsInfo =
        await proposalContract.getActiveInvestmentsInfo(account, proposalId, 1)

      if (_userActiveInvestmentsInfo && _userActiveInvestmentsInfo[0]) {
        setYourSizeLP(_userActiveInvestmentsInfo[0].lpInvested)
      }
    } catch (e) {
      console.error("Failed to load user active investments info")
    }
  }, [account, proposalId, proposalContract])

  const loadTraderActiveInvestmentsInfo = useCallback(async () => {
    if (!poolInfo || !proposalContract) return
    try {
      const _userActiveInvestmentsInfo =
        await proposalContract.getActiveInvestmentsInfo(
          poolInfo.parameters.trader,
          proposalId,
          1
        )

      if (_userActiveInvestmentsInfo && _userActiveInvestmentsInfo[0]) {
        setTraderSizeLP(_userActiveInvestmentsInfo[0].lpInvested)
      }
    } catch (e) {
      console.error("Failed to load trader active investments info")
    }
  }, [poolInfo, proposalId, proposalContract])

  const loadMarkPriceOpen = useCallback(async () => {
    if (!priceFeed || !proposalToken) return
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
  }, [priceFeed, proposalToken])

  const loadTokenRating = useCallback(async () => {
    if (!chainId || !proposal) return
    try {
      const rating = await getTokenRating(chainId, proposal.proposalInfo.token)
      setTokenRating(rating)
    } catch (error) {
      console.error(error)
    }
  }, [chainId, proposal, getTokenRating])

  const init = useCallback(async () => {
    try {
      await loadDetailsFromIpfs()
      await loadMaxPoolInvestors()
      await loadUserActiveInvestmentsInfo()
      await loadTraderActiveInvestmentsInfo()
      await loadMarkPriceOpen()
      await loadTokenRating()
    } catch (error) {}
  }, [
    loadDetailsFromIpfs,
    loadMaxPoolInvestors,
    loadUserActiveInvestmentsInfo,
    loadTraderActiveInvestmentsInfo,
    loadMarkPriceOpen,
    loadTokenRating,
  ])

  useEffect(() => {
    init()
  }, [proposal, init])

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

  return useMemo(
    () => [
      {
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
        description,
        maximumPoolInvestors,
        isTrader,
        proposalContract,
        poolInfo,
        poolMetadata,
      },
      { onUpdateRestrictions },
    ],
    [
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
      description,
      maximumPoolInvestors,
      isTrader,
      proposalContract,
      poolInfo,
      poolMetadata,

      onUpdateRestrictions,
    ]
  )
}
