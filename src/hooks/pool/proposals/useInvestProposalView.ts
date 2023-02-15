import { useWeb3React } from "@web3-react/core"
import { ZERO } from "consts"
import {
  useCorePropertiesContract,
  usePriceFeedContract,
  useTraderPoolInvestProposalContract,
} from "contracts"
import { BigNumber } from "@ethersproject/bignumber"
import { usePoolContract, usePoolPrice } from "hooks"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { isEmpty } from "lodash"
import * as React from "react"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { IPoolMetadata } from "state/ipfsMetadata/types"
import { InvestProposalMetadata, WrappedInvestProposalView } from "types"
import { addBignumbers, percentageOfBignumbers } from "utils/formulas"
import { IpfsEntity } from "utils/ipfsEntity"
import { expandTimestamp } from "utils"
import { parseUnits } from "@ethersproject/units"
import { useERC20Data } from "state/erc20/hooks"
import { Token } from "interfaces"
import { TraderPoolInvestProposal } from "interfaces/typechain"

type Response = {
  isTrader: boolean
  poolMetadata: IPoolMetadata | null
  proposalMetadata: InvestProposalMetadata
  poolInfo: IPoolInfo | null
  baseTokenData: Token | null
  proposalPool: TraderPoolInvestProposal | null

  dividentsTotalAmount: BigNumber
  yourBalance: BigNumber
  isUserHaveInvestments: boolean
  fullness: BigNumber
  expirationTimestamp: number
  expirationDateCompleted: boolean
  poolPriceUSD: BigNumber
  supply: BigNumber
  supplyCompleted: boolean
  apr: BigNumber
  dividendsAvailable: BigNumber
  youSizeLP: BigNumber
  maxSizeLP: BigNumber
  totalInvestors: BigNumber
  maximumPoolInvestors: BigNumber
  isCompleted: boolean

  onUpdateRestrictions: (timestamp: number, maxSize: BigNumber) => void
}

const useInvestProposalView = (
  payload: WrappedInvestProposalView
): Response => {
  const { payloadContract, payloadQuery, utilityIds } = payload

  const { account } = useWeb3React()
  const priceFeed = usePriceFeedContract()
  const [{ priceUSD: poolPriceUSD }] = usePoolPrice(
    utilityIds.investPoolAddress
  )
  const [baseTokenData] = useERC20Data(utilityIds.investPoolBaseTokenAddress)
  const corePropertiesContract = useCorePropertiesContract()
  const [, poolInfo] = usePoolContract(utilityIds.investPoolAddress)
  const proposalPool = useTraderPoolInvestProposalContract(
    utilityIds.investPoolAddress
  )
  const [{ poolMetadata }] = usePoolMetadata(
    utilityIds.investPoolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const isTrader = React.useMemo(() => {
    if (!account || !poolInfo) return false
    return (
      String(account).toLowerCase() ===
      String(poolInfo?.parameters.trader).toLowerCase()
    )
  }, [account, poolInfo])

  const [proposalMetadata, setProposalMetadata] =
    React.useState<InvestProposalMetadata>({ ticker: "", description: "" })
  const fetchProposalMetadata = React.useCallback(async () => {
    if (!payloadContract) return { ticker: "", description: "" }

    try {
      const proposalIpfsEntry = new IpfsEntity<InvestProposalMetadata>({
        path: payloadContract.proposalInfo.descriptionURL,
      })
      return proposalIpfsEntry.load()
    } catch (error) {
      console.error(error)
      return { ticker: "", description: "" }
    }
  }, [payloadContract])
  React.useEffect(() => {
    fetchProposalMetadata().then((metadata) => {
      setProposalMetadata(metadata)
    })
  }, [fetchProposalMetadata])

  const [dividentsTotalAmount, setDividentsTotalAmount] = React.useState(ZERO)
  const fetchDividentsTotalAmount = React.useCallback(async () => {
    if (
      !priceFeed ||
      isEmpty(payloadQuery?.leftTokens) ||
      isEmpty(payloadQuery?.leftAmounts)
    ) {
      return ZERO
    }

    try {
      const { leftTokens, leftAmounts } = payloadQuery

      let _dividentsTotalAmount = ZERO

      for (const [index, token] of leftTokens.entries()) {
        const amountPrice = await priceFeed.getNormalizedPriceOutUSD(
          token,
          leftAmounts[index]
        )

        if (amountPrice && amountPrice.amountOut) {
          _dividentsTotalAmount = addBignumbers(
            [_dividentsTotalAmount, 18],
            [amountPrice.amountOut, 18]
          )
        }
      }
      return _dividentsTotalAmount
    } catch (error) {
      console.error(error)
      return ZERO
    }
  }, [priceFeed, payloadQuery])
  React.useEffect(() => {
    fetchDividentsTotalAmount().then((amount) => {
      setDividentsTotalAmount(amount)
    })
  }, [fetchDividentsTotalAmount])

  const [yourBalance, setYourBalance] = React.useState<BigNumber>(ZERO)
  const fetchYourBalance = React.useCallback(async () => {
    if (!proposalPool || !account) return ZERO
    try {
      return proposalPool.balanceOf(account, utilityIds.proposalId)
    } catch (error) {
      console.error(error)
      return ZERO
    }
  }, [proposalPool, account, utilityIds])
  React.useEffect(() => {
    fetchYourBalance().then((amount) => {
      setYourBalance(amount)
    })
  }, [fetchYourBalance])

  const isUserHaveInvestments = React.useMemo(
    () => yourBalance.gt(0),
    [yourBalance]
  )

  const fullness = React.useMemo<BigNumber>(() => {
    if (
      payloadContract.proposalInfo.proposalLimits.investLPLimit.isZero() ||
      dividentsTotalAmount.isZero()
    ) {
      return ZERO
    }

    return percentageOfBignumbers(
      payloadContract.proposalInfo.proposalLimits.investLPLimit,
      dividentsTotalAmount
    )
  }, [payloadContract, dividentsTotalAmount])

  const [expirationTimestamp, setExpirationTimestamp] = React.useState(0)
  const [expirationDateCompleted, setExpirationDateCompleted] =
    React.useState(false)

  React.useEffect(() => {
    if (!payloadContract?.proposalInfo.proposalLimits.timestampLimit) {
      return
    }

    const { timestampLimit } = payloadContract.proposalInfo.proposalLimits
    const _timestampLimit = Number(timestampLimit.toString())
    const currentTimestamp = new Date().valueOf()

    setExpirationTimestamp(_timestampLimit)
    setExpirationDateCompleted(
      currentTimestamp - expandTimestamp(_timestampLimit) >= 0
    )
  }, [payloadContract])

  const [maxSizeLP, setMaxSizeLP] = React.useState<BigNumber>(ZERO)
  React.useEffect(() => {
    setMaxSizeLP(payloadContract.proposalInfo.proposalLimits.investLPLimit)
  }, [payloadContract])

  const supply = React.useMemo(() => {
    if (!payloadContract.proposalInfo.investedBase) {
      return ZERO
    }

    return payloadContract.proposalInfo.investedBase
  }, [payloadContract])

  const supplyCompleted = React.useMemo(
    () => supply.gte(maxSizeLP),
    [supply, maxSizeLP]
  )

  const apr = React.useMemo(
    () => parseUnits(payloadQuery.APR, "wei"),
    [payloadQuery]
  )

  const dividendsAvailable = React.useMemo(
    () => parseUnits(payloadQuery.totalUSDSupply, "wei"),
    [payloadQuery]
  )

  const [youSizeLP, setYouSizeLP] = React.useState(ZERO)
  const fetchYouSizeLP = React.useCallback(async () => {
    if (!proposalPool || !account) return ZERO
    try {
      const activeInvestmentsInfo = await proposalPool.getActiveInvestmentsInfo(
        account,
        0,
        1
      )
      if (activeInvestmentsInfo && activeInvestmentsInfo[0]) {
        return activeInvestmentsInfo[0].lpInvested
      } else {
        return ZERO
      }
    } catch (error) {
      console.error(error)
      return ZERO
    }
  }, [proposalPool, account])
  React.useEffect(() => {
    fetchYouSizeLP().then((res) => setYouSizeLP(res))
  }, [fetchYouSizeLP])

  const totalInvestors = React.useMemo(() => {
    return payloadContract.totalInvestors
  }, [payloadContract])

  const [maximumPoolInvestors, setMaximumPoolInvestors] =
    React.useState<BigNumber>(ZERO)

  const loadMaxPoolInvestors = React.useCallback(async () => {
    if (!corePropertiesContract) return ZERO
    try {
      return corePropertiesContract.getMaximumPoolInvestors()
    } catch (e) {
      console.error("Failed to load maximum pool investors")
      return ZERO
    }
  }, [corePropertiesContract])

  React.useEffect(() => {
    loadMaxPoolInvestors().then((res) => setMaximumPoolInvestors(res))
  }, [loadMaxPoolInvestors])

  const isCompleted = React.useMemo(
    () => expirationDateCompleted || supplyCompleted,
    [expirationDateCompleted, supplyCompleted]
  )

  const onUpdateRestrictions = React.useCallback(
    (timestamp?: number, maxSize?: BigNumber) => {
      if (timestamp) {
        const expanded = expandTimestamp(timestamp)
        const currentTimestamp = new Date().valueOf()

        setExpirationTimestamp(timestamp)
        setExpirationDateCompleted(currentTimestamp - expanded >= 0)
      }

      if (maxSize) {
        setMaxSizeLP(maxSize)
      }
    },
    []
  )

  return React.useMemo(
    () => ({
      isTrader,
      poolInfo,
      poolMetadata,
      proposalMetadata,
      baseTokenData,
      proposalPool,

      dividentsTotalAmount,
      yourBalance,
      isUserHaveInvestments,
      fullness,
      expirationTimestamp,
      expirationDateCompleted,
      poolPriceUSD,
      supply,
      supplyCompleted,
      apr,
      dividendsAvailable,
      youSizeLP,
      maxSizeLP,
      totalInvestors,
      maximumPoolInvestors,
      isCompleted,

      onUpdateRestrictions,
    }),
    [
      isTrader,
      poolInfo,
      poolMetadata,
      proposalMetadata,
      baseTokenData,
      proposalPool,

      dividentsTotalAmount,
      yourBalance,
      isUserHaveInvestments,
      fullness,
      expirationTimestamp,
      expirationDateCompleted,
      poolPriceUSD,
      supply,
      supplyCompleted,
      apr,
      dividendsAvailable,
      youSizeLP,
      maxSizeLP,
      totalInvestors,
      maximumPoolInvestors,
      isCompleted,

      onUpdateRestrictions,
    ]
  )
}

export default useInvestProposalView
