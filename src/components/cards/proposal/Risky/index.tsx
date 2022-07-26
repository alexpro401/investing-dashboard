import {
  MouseEvent,
  FC,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { Contract } from "@ethersproject/contracts"
import { BigNumber } from "@ethersproject/bignumber"

import { useActiveWeb3React } from "hooks"
import { useERC20 } from "hooks/useContract"
import { percentageOfBignumbers } from "utils/formulas"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { expandTimestamp, normalizeBigNumber } from "utils"
import { RiskyProposal, PoolInfo } from "constants/interfaces_v2"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import { Flex } from "theme"
import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import IconButton from "components/IconButton"
import ExternalLink from "components/ExternalLink"
import Button, { SecondaryButton } from "components/Button"

import S from "./styled"
import RiskyCardSettings from "./Settings"
import SharedS, {
  BodyItem,
  TraderLPSize,
} from "components/cards/proposal/styled"

import settingsIcon from "assets/icons/settings.svg"
import settingsGreenIcon from "assets/icons/settings-green.svg"

const MAX_INVESTORS_COUNT = 1000

interface Props {
  proposal: RiskyProposal
  proposalId: number
  poolAddress: string
  proposalPool: Contract | null
  isTrader: boolean
  poolInfo: PoolInfo
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
  const [, proposalToken] = useERC20(proposal.proposalInfo.token)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)

  const [yourSizeLP, setYourSizeLP] = useState<BigNumber>(BigNumber.from("0"))
  const [traderSizeLP, setTraderSizeLP] = useState<BigNumber>(
    BigNumber.from("0")
  )

  /**
   * Symbol of proposal
   */
  const proposalSymbol = useMemo<string>(() => {
    if (!proposalToken || !proposalToken.symbol) return ""
    return proposalToken.symbol
  }, [proposalToken])

  /**
   * Proposal limit in LP's
   */
  const maxSizeLP = useMemo<{ value: BigNumber; normalized: string }>(() => {
    if (!proposal || !proposal?.proposalInfo.proposalLimits.investLPLimit) {
      return { value: BigNumber.from("0"), normalized: "0" }
    }

    const { investLPLimit } = proposal.proposalInfo.proposalLimits

    return {
      value: investLPLimit,
      normalized: normalizeBigNumber(investLPLimit, 18, 6),
    }
  }, [proposal])

  /**
   * Proposal fullness in LP's
   */
  const fullness = useMemo<{ value: string; completed: boolean }>(() => {
    if (
      !proposal?.proposalInfo?.proposalLimits?.investLPLimit ||
      !proposal.proposalInfo.lpLocked
    ) {
      return { value: "0", completed: false }
    }

    const { lpLocked, proposalLimits } = proposal.proposalInfo

    return {
      value: normalizeBigNumber(lpLocked, 18, 6),
      completed: lpLocked.gte(proposalLimits.investLPLimit),
    }
  }, [proposal])

  /**
   * Maximum price of proposal token
   * @returns value - maximum price
   * @returns completed - true if positionTokenPrice >= maxTokenPriceLimit
   */
  const maxInvestPrice = useMemo<{ value: string; completed: boolean }>(() => {
    if (
      !proposal ||
      !proposal?.proposalInfo.proposalLimits.maxTokenPriceLimit
    ) {
      return { value: "0", completed: false }
    }

    const {
      positionTokenPrice,
      proposalInfo: { proposalLimits },
    } = proposal

    return {
      value: normalizeBigNumber(proposalLimits.maxTokenPriceLimit, 18, 2),
      completed: positionTokenPrice.gte(proposalLimits.maxTokenPriceLimit),
    }
  }, [proposal])

  /**
   * Exact price on 1 position token in base tokens
   */
  const currentPrice = useMemo<string>(() => {
    if (!proposal || !proposal?.positionTokenPrice) {
      return "0"
    }

    return normalizeBigNumber(proposal.positionTokenPrice, 18, 2)
  }, [proposal])

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
   * Date of proposal expiration
   * @returns value - expiration date
   * @returns completed - true if expiration date greater that current
   */
  const expirationDate = useMemo<{ value: string; completed: boolean }>(() => {
    if (!proposal || !proposal?.proposalInfo.proposalLimits.timestampLimit) {
      return { value: "0", completed: false }
    }

    const { timestampLimit } = proposal.proposalInfo.proposalLimits

    const expandedTimestampLimit = expandTimestamp(
      Number(timestampLimit.toString())
    )
    const currentTimestamp = new Date().valueOf()

    return {
      value: format(expandedTimestampLimit, "MMM dd, y HH:mm"),
      completed: currentTimestamp - expandedTimestampLimit >= 0,
    }
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
      return BigNumber.from("0")
    }

    return percentageOfBignumbers(traderSizeLP, maxSizeLP.value)
  }, [maxSizeLP, traderSizeLP])

  /**
   * Indicating that proposal open or closed for investment (respectively true or false)
   */
  const canInvest = useMemo<boolean>(() => {
    return !expirationDate.completed && !maxInvestPrice.completed
  }, [expirationDate.completed, maxInvestPrice.completed])

  // Fetch current user locked funds in proposal
  useEffect(() => {
    if (!proposalPool || proposalId === undefined) {
      return
    }

    ;(async () => {
      try {
        const balance = await proposalPool?.balanceOf(account, proposalId)
        if (balance) {
          setYourSizeLP(balance)
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
        const balance = await proposalPool.balanceOf(
          poolInfo.parameters.trader,
          proposalId
        )

        if (balance) {
          setTraderSizeLP(balance)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [poolInfo, proposalId, proposalPool])

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
      navigate(`/invest-risky-proposal/${poolAddress}/${proposalId}`)
    },
    [navigate, poolAddress, proposalId]
  )

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
            <SharedS.Title>{proposalSymbol}</SharedS.Title>
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
          <RiskyCardSettings
            visible={isSettingsOpen}
            setVisible={setIsSettingsOpen}
          />
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
            amount={currentPrice}
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
            <Flex>
              <SharedS.FundIconContainer>
                <Icon
                  size={24}
                  m="0"
                  source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
                  address={poolAddress}
                />
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
