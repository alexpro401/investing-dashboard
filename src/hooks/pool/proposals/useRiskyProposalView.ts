import { useCallback, useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { BigNumber } from "@ethersproject/bignumber"
import { isEmpty } from "lodash"
import { useWeb3React } from "@web3-react/core"

import { TraderPoolRiskyProposal } from "interfaces/typechain"
import { useContract } from "hooks"
import { useERC20Data } from "state/erc20/hooks"
import { DATE_TIME_FORMAT, ZERO } from "consts"
import { expandTimestamp } from "utils"
import { percentageOfBignumbers } from "utils/formulas"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { Token } from "interfaces"
import { IpfsEntity } from "utils/ipfsEntity"
import * as React from "react"
import { WrappedRiskyProposalView } from "types"
import { TraderPoolRiskyProposal as TraderPoolRiskyProposal_ABI } from "abi"
import { IPoolMetadata } from "state/ipfsMetadata/types"

export type UseRiskyProposalViewResponseValues = {
  tokenRating: number
  canInvest: boolean
  proposalTokenLink: string
  maxSizeLP: BigNumber
  fullness: {
    value: BigNumber
    completed: boolean
  }
  maxInvestPrice: {
    value: BigNumber
    completed: boolean
  }
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
  proposalContract: TraderPoolRiskyProposal | null
  poolMetadata: any
}
type UseRiskyProposalViewResponseMethods = {
  onUpdateRestrictions: (
    timestamp: number,
    maxSize: BigNumber,
    maxInvest: BigNumber
  ) => void
}

type UseRiskyProposalViewResponse = [
  UseRiskyProposalViewResponseValues,
  UseRiskyProposalViewResponseMethods
]
export const useRiskyProposalView = (
  funcArgs: WrappedRiskyProposalView
): UseRiskyProposalViewResponse => {
  const {
    proposal,
    utilityIds,
    poolInfo,
    isTrader,
    maximumPoolInvestors,
    proposalTokenRating,
  } = funcArgs
  const { proposalId, proposalContractAddress, proposalTokenAddress } =
    utilityIds

  const { chainId } = useWeb3React()
  const [proposalToken] = useERC20Data(proposalTokenAddress)
  const proposalContract = useContract<TraderPoolRiskyProposal>(
    proposalContractAddress,
    TraderPoolRiskyProposal_ABI
  )

  const [poolMetadata, setPoolMetadata] = useState<IPoolMetadata | null>(null)
  const [traderSizeLP, setTraderSizeLP] = useState<BigNumber>(ZERO)
  const [description, setDescription] = useState<string>("")

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
      proposalTokenAddress,
      ExplorerDataType.ADDRESS
    )
  }, [chainId, proposalTokenAddress])

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

  const loadPoolMetadata = useCallback(async () => {
    if (isEmpty(poolInfo.parameters.descriptionURL)) {
      return null
    }
    try {
      const riskyProposalIpfsEntity = new IpfsEntity<IPoolMetadata>({
        path: poolInfo.parameters.descriptionURL,
      })

      return riskyProposalIpfsEntity.load()
    } catch (e) {
      console.error("Failed to load pool IPFS info")
      return null
    }
  }, [poolInfo])

  React.useEffect(() => {
    loadPoolMetadata().then((res) => setPoolMetadata(res))
  }, [loadPoolMetadata])

  const loadDetailsFromIpfs = useCallback(async () => {
    if (isEmpty(proposal.proposalInfo.descriptionURL)) return ""
    try {
      const riskyProposalIpfsEntity = new IpfsEntity<string>({
        path: proposal.proposalInfo.descriptionURL,
      })

      return riskyProposalIpfsEntity.load()
    } catch (e) {
      console.error("Failed to load description")
      return ""
    }
  }, [proposal])

  React.useEffect(() => {
    loadDetailsFromIpfs().then((res) => setDescription(res))
  }, [loadDetailsFromIpfs])

  const loadTraderActiveInvestmentsInfo = useCallback(async () => {
    if (!poolInfo || !proposalContract || isTrader) return ZERO
    try {
      const _userActiveInvestmentsInfo =
        await proposalContract.getActiveInvestmentsInfo(
          poolInfo.parameters.trader,
          proposalId,
          1
        )

      if (_userActiveInvestmentsInfo && _userActiveInvestmentsInfo[0]) {
        return _userActiveInvestmentsInfo[0].lpInvested
      } else {
        return ZERO
      }
    } catch (e) {
      console.error("Failed to load trader active investments info")
      return ZERO
    }
  }, [poolInfo, proposalId, proposalContract, isTrader])

  React.useEffect(() => {
    loadTraderActiveInvestmentsInfo().then((res) => setTraderSizeLP(res))
  }, [loadTraderActiveInvestmentsInfo])

  const onUpdateRestrictions = useCallback(
    (timestamp: number, maxSize: BigNumber, maxInvest: BigNumber) => {
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
    },
    [proposal]
  )

  return useMemo(
    () => [
      {
        tokenRating: proposalTokenRating,
        canInvest,
        proposalTokenLink,
        maxSizeLP,
        fullness,
        maxInvestPrice,
        expirationDate,
        investors,
        positionSize,
        traderSizeLP,
        traderSizePercentage,
        proposalToken,
        description,
        maximumPoolInvestors,
        proposalContract,
        poolMetadata,
      },
      { onUpdateRestrictions },
    ],
    [
      proposalTokenRating,
      canInvest,
      proposalTokenLink,
      maxSizeLP,
      fullness,
      maxInvestPrice,
      expirationDate,
      investors,
      positionSize,
      traderSizeLP,
      traderSizePercentage,
      proposalToken,
      description,
      maximumPoolInvestors,
      proposalContract,
      poolMetadata,

      onUpdateRestrictions,
    ]
  )
}
