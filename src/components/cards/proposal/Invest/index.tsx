import {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { BigNumber } from "@ethersproject/bignumber"

import { ZERO } from "constants/index"
import { getIpfsData } from "utils/ipfs"
import { useActiveWeb3React } from "hooks"
import usePoolPrice from "hooks/usePoolPrice"
import { usePoolContract } from "hooks/usePool"
import { DATE_TIME_FORMAT } from "constants/time"
import { InvestProposal } from "interfaces/thegraphs/invest-pools"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import useInvestProposalData from "hooks/useInvestProposalData"
import { addBignumbers, percentageOfBignumbers } from "utils/formulas"
import { expandTimestamp, formatBigNumber, normalizeBigNumber } from "utils"
import {
  useERC20,
  useInvestProposalContract,
  usePriceFeedContract,
} from "hooks/useContract"

import { Flex } from "theme"
import Icon from "components/Icon"
import Skeleton from "components/Skeleton"
import ReadMore from "components/ReadMore"
import TokenIcon from "components/TokenIcon"
import IconButton from "components/IconButton"
import { Actions } from "components/cards/proposal/styled"

import S from "./styled"
import BodyTrader from "./BodyTrader"
import BodyInvestor from "./BodyInvestor"
import InvestCardSettings from "./Settings"

import settingsIcon from "assets/icons/settings.svg"
import settingsGreenIcon from "assets/icons/settings-green.svg"

interface Props {
  proposal: InvestProposal
  poolAddress: string
}

const InvestProposalCard: FC<Props> = ({ proposal, poolAddress }) => {
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const priceFeed = usePriceFeedContract()

  const [{ priceUSD }] = usePoolPrice(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)
  const [, baseTokenData] = useERC20(poolInfo?.parameters.baseToken)
  const [proposalPool, proposalAddress] = useInvestProposalContract(poolAddress)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  // Check that current user is pool trader or not
  const isTrader = useMemo(() => {
    if (!account || !poolInfo) return null
    return account === poolInfo?.parameters.trader
  }, [account, poolInfo])

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [openExtra, setOpenExtra] = useState<boolean>(false)
  const toggleExtra = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      setOpenExtra(!openExtra)
    },
    [openExtra]
  )
  const toggleSettings = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      setIsSettingsOpen(!isSettingsOpen)
    },
    [isSettingsOpen]
  )

  // Proposal data from IPFS
  const [ticker, setTicker] = useState<string>("")
  const [description, setDescription] = useState<string | null>(null)
  // Proposal data from proposals contract
  const [proposalId, setProposalId] = useState<string>("0")
  const [youSizeLP, setYouSizeLP] = useState<string>("0")
  const [yourBalance, setYourBalance] = useState<BigNumber>(ZERO)

  // Pool base token ticker
  const baseTokenTicker = useMemo(() => {
    if (!baseTokenData || !baseTokenData.symbol) {
      return ""
    }

    return baseTokenData.symbol
  }, [baseTokenData])

  // Check that user already invested in proposal
  const invested = useMemo(() => yourBalance.gt(0), [yourBalance])

  // Proposal data from Graph
  const proposalInfo = useInvestProposalData(
    String(proposalAddress + proposalId).toLowerCase()
  )
  const [totalDividendsAmount, setTotalDividendsAmount] =
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
  const [maxSizeLP, setMaxSizeLP] = useState<{
    value: BigNumber
    normalized: string
  }>({ value: ZERO, normalized: "0" })

  /**
   * Supply
   */
  const supply = useMemo(() => {
    if (!proposal || !proposal.proposalInfo.investedBase) {
      return "0"
    }
    return normalizeBigNumber(proposal.proposalInfo.investedBase, 18, 6)
  }, [proposal])

  /**
   * Count of proposal investors
   */
  const totalInvestors = useMemo<string>(() => {
    if (!proposal || !proposal.totalInvestors) return "0"

    return proposal.totalInvestors.toString()
  }, [proposal])

  /**
   * APR
   */
  const APR = useMemo<string>(() => {
    if (!proposalInfo || !proposalInfo.APR) return "0"
    return normalizeBigNumber(proposalInfo.APR, 4, 2)
  }, [proposalInfo])

  /**
   * Available dividends
   */
  const dividendsAvailable = useMemo<string>(() => {
    if (!proposalInfo || !proposalInfo.totalUSDSupply) {
      return "0"
    }
    return normalizeBigNumber(proposalInfo.totalUSDSupply, 18, 6)
  }, [proposalInfo])

  /**
   * Fullness in %
   */
  const fullness = useMemo<BigNumber>(() => {
    if (
      !proposal ||
      !proposal.proposalInfo.proposalLimits.investLPLimit ||
      proposal.proposalInfo.proposalLimits.investLPLimit.isZero() ||
      !totalDividendsAmount ||
      totalDividendsAmount.isZero()
    ) {
      return ZERO
    }

    return percentageOfBignumbers(
      proposal.proposalInfo.proposalLimits.investLPLimit,
      totalDividendsAmount
    )
  }, [proposal, totalDividendsAmount])

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
      normalized: formatBigNumber(investLPLimit, 18, 6),
    })
  }, [proposal])

  // Get proposal data from IPFS
  useEffect(() => {
    if (!proposal) return
    ;(async () => {
      try {
        const ipfsMetadata = await getIpfsData(
          proposal.proposalInfo.descriptionURL
        )

        if (ipfsMetadata) {
          setTicker(ipfsMetadata.ticker)
          setDescription(ipfsMetadata.description)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [proposal])

  // Get proposal "active investment info" for current connected account
  useEffect(() => {
    if (!proposalPool) return
    ;(async () => {
      try {
        const activeInvestmentsInfo =
          await proposalPool.getActiveInvestmentsInfo(account, 0, 1)
        if (activeInvestmentsInfo && activeInvestmentsInfo[0]) {
          setProposalId(
            String(Number(activeInvestmentsInfo[0].proposalId.toString()) - 1)
          )
          setYouSizeLP(
            formatBigNumber(activeInvestmentsInfo[0].lpInvested, 18, 6)
          )
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [account, proposalPool])

  // Get prices of all left tokens amounts
  useEffect(() => {
    if (
      !priceFeed ||
      !proposalInfo ||
      !proposalInfo.leftTokens ||
      !proposalInfo.leftTokens.length ||
      !proposalInfo.leftAmounts ||
      !proposalInfo.leftAmounts.length
    ) {
      return
    }

    ;(async () => {
      try {
        const { leftTokens, leftAmounts } = proposalInfo

        for (const [index, token] of leftTokens.entries()) {
          const amountPrice = await priceFeed.getNormalizedPriceOutUsd(
            token,
            leftAmounts[index]
          )

          if (amountPrice && amountPrice.amountOut) {
            setTotalDividendsAmount(
              addBignumbers(
                [totalDividendsAmount, 18],
                [amountPrice.amountOut, 18]
              )
            )
          }
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [proposalInfo, priceFeed, totalDividendsAmount])

  // Get investor balance in proposal
  useEffect(() => {
    if (!account || !proposalId || !proposalPool) {
      return
    }

    ;(async () => {
      try {
        const balance = await proposalPool.balanceOf(account, proposalId)

        if (balance) {
          setYourBalance(balance)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [account, proposalId, proposalPool])

  enum TerminalType {
    Invest = "invest",
    Withdraw = "withdraw",
    PayDividends = "pay-dividends",
  }

  const onTerminalNavigate = useCallback(
    (t: TerminalType) => {
      if (!poolAddress || !proposalId) return
      navigate(`/${t}-investment-proposal/${poolAddress}/${proposalId}`)
    },
    [navigate, poolAddress, proposalId]
  )

  // Actions
  const actions = useMemo(() => {
    if (isTrader === null) {
      return []
    }
    if (isTrader) {
      return [
        {
          label: "Withdraw",
          onClick: () => onTerminalNavigate(TerminalType.Withdraw),
        },
        {
          label: "Deposit",
          onClick: () => onTerminalNavigate(TerminalType.Invest),
        },
        {
          label: "Claim",
          onClick: () => {
            // TODO: implement navigation to claim modal
            console.log("Claim")
          },
        },
        {
          label: "Pay dividend",
          onClick: () => onTerminalNavigate(TerminalType.PayDividends),
        },
      ]
    }
    return [
      {
        label: "Stake LP",
        onClick: () => onTerminalNavigate(TerminalType.Invest),
      },
      {
        label: "Request a dividend",
        onClick: () => onTerminalNavigate(TerminalType.PayDividends),
      },
    ]
  }, [TerminalType, isTrader, onTerminalNavigate])

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

  const onUpdateRestrictions = (timestamp: number, maxSize: BigNumber) => {
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
  }

  const headerRight = useMemo(() => {
    if (isTrader === null) {
      return (
        <Flex>
          <Skeleton m="0 4px 0 0" />
          <Skeleton variant="circle" />
        </Flex>
      )
    }

    return isTrader ? (
      <>
        <Flex>
          <S.Status active={!proposal.closed}>
            {!proposal.closed ? "Open investing" : "Closed investing"}
          </S.Status>
          <Flex m="0 0 0 4px">
            <IconButton
              size={12}
              media={isSettingsOpen ? settingsGreenIcon : settingsIcon}
              onClick={toggleSettings}
            />
          </Flex>
        </Flex>
        <InvestCardSettings
          ticker={ticker}
          visible={isSettingsOpen}
          setVisible={setIsSettingsOpen}
          proposalPool={proposalPool}
          proposalId={proposalId}
          successCallback={onUpdateRestrictions}
          timestamp={expirationDate.initial}
          maxSizeLP={maxSizeLP.value}
          fullness={fullness}
        />
      </>
    ) : (
      <Flex onClick={navigateToPool}>
        <S.FundSymbol>{poolInfo?.ticker}</S.FundSymbol>
        <TokenIcon address={poolInfo?.parameters.baseToken} m="0" size={24} />
      </Flex>
    )
  }, [isTrader])

  const body = useMemo(() => {
    if (isTrader === null) {
      const fakeItems = Array(6).fill(null)

      return (
        <>
          {fakeItems.map((_, index) => (
            <div key={index}>
              <Skeleton h="16px" />
              <Skeleton h="13px" m={"8px 0"} />
              <Skeleton h="10px" />
            </div>
          ))}
        </>
      )
    }

    return isTrader ? (
      <BodyTrader
        ticker={ticker}
        supply={supply}
        youSizeLP={youSizeLP}
        maxSizeLP={maxSizeLP.normalized}
        apr={APR}
        dividendsAvailable={dividendsAvailable}
        totalDividends={normalizeBigNumber(totalDividendsAmount, 18, 6)}
        totalInvestors={totalInvestors}
        expirationDate={expirationDate.value}
      />
    ) : (
      <BodyInvestor
        ticker={ticker}
        baseTokenTicker={baseTokenTicker}
        fullness={normalizeBigNumber(fullness, 18, 2)}
        yourBalance={normalizeBigNumber(yourBalance, 18, 6)}
        supply={supply}
        invested={invested}
        apr={APR}
        dividendsAvailable={dividendsAvailable}
        totalDividends={normalizeBigNumber(totalDividendsAmount, 18, 6)}
        expirationDate={expirationDate.value}
        poolPriceUSD={normalizeBigNumber(priceUSD, 18, 2)}
        onInvest={() => onTerminalNavigate(TerminalType.Invest)}
      />
    )
  }, [isTrader])

  return (
    <>
      <S.Container>
        <S.Card onClick={toggleExtra}>
          <S.Head isTrader={isTrader}>
            <Flex>
              <Icon
                size={24}
                m="0"
                source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
                address={poolAddress}
              />
              <S.Title>{ticker}</S.Title>
            </Flex>
            {headerRight}
          </S.Head>
          <S.Body>{body}</S.Body>
          <S.ReadMoreContainer>
            {description === null ? (
              <Skeleton variant="rect" />
            ) : (
              <ReadMore content={description} maxLen={85} />
            )}
          </S.ReadMoreContainer>
        </S.Card>
        <AnimatePresence>
          {!proposal.closed && (
            <Actions actions={actions} visible={openExtra} />
          )}
        </AnimatePresence>
      </S.Container>
    </>
  )
}

export default InvestProposalCard
