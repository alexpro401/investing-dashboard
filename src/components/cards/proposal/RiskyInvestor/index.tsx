import { FC, useMemo, useCallback, useState, useEffect } from "react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"

import { useActiveWeb3React } from "hooks"
import { usePoolContract } from "hooks/usePool"
import { RiskyProposal } from "constants/interfaces_v2"
import { percentageOfBignumbers } from "utils/formulas"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { expandTimestamp, normalizeBigNumber } from "utils"
import { useERC20, useRiskyProposalContract } from "hooks/useContract"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import { Flex } from "theme"
import Icon from "components/Icon"
import Tooltip from "components/Tooltip"
import TokenIcon from "components/TokenIcon"
import ExternalLink from "components/ExternalLink"
import Button, { SecondaryButton } from "components/Button"

import S, { TraderLPSize, TraderRating } from "./styled"
import SharedS, { BodyItem } from "components/cards/proposal/styled"

interface Props {
  proposal: RiskyProposal
  poolAddress: string
  proposalId: number
}

const RiskyProposalInvestorCard: FC<Props> = ({
  proposal,
  poolAddress,
  proposalId,
}) => {
  const navigate = useNavigate()
  const { account, chainId } = useActiveWeb3React()
  const [, proposalTokenData] = useERC20(proposal.proposalInfo.token)
  const [, poolInfo] = usePoolContract(poolAddress)
  const [proposalPool] = useRiskyProposalContract(poolAddress)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const [youSizeLP, setYouSizeLP] = useState<BigNumber>(BigNumber.from("0"))
  const [traderSizeLP, setTraderSizeLP] = useState<BigNumber>(
    BigNumber.from("0")
  )

  const proposalSymbol = useMemo(() => {
    if (!proposalTokenData || !proposalTokenData.symbol) return ""
    return proposalTokenData.symbol
  }, [proposalTokenData])

  const maxSizeLP = useMemo(() => {
    if (!proposal || !proposal?.proposalInfo.proposalLimits.investLPLimit) {
      return BigNumber.from("0")
    }

    return proposal.proposalInfo.proposalLimits.investLPLimit
  }, [proposal])

  const fullness = useMemo(() => {
    if (
      !proposal?.proposalInfo?.proposalLimits?.investLPLimit ||
      !proposal.proposalInfo.lpLocked
    ) {
      return { value: "0", completed: false }
    }

    return {
      value: normalizeBigNumber(proposal.proposalInfo.lpLocked, 18, 2),
      completed: proposal.proposalInfo.lpLocked.eq(
        proposal.proposalInfo.proposalLimits.investLPLimit
      ),
    }
  }, [
    proposal.proposalInfo.lpLocked,
    proposal.proposalInfo.proposalLimits.investLPLimit,
  ])

  const maxInvestPrice = useMemo(() => {
    if (
      !proposal ||
      !proposal?.proposalInfo.proposalLimits.maxTokenPriceLimit
    ) {
      return { value: "0", completed: false }
    }

    return {
      value: normalizeBigNumber(
        proposal.proposalInfo.proposalLimits.maxTokenPriceLimit,
        18,
        2
      ),
      completed: proposal.positionTokenPrice.gte(
        proposal.proposalInfo.proposalLimits.maxTokenPriceLimit
      ),
    }
  }, [proposal])

  const currentPrice = useMemo(() => {
    if (!proposal || !proposal?.positionTokenPrice) {
      return "0"
    }

    return normalizeBigNumber(proposal.positionTokenPrice, 18, 2)
  }, [proposal])

  const expirationDate = useMemo(() => {
    if (!proposal) return { value: "0", completed: false }

    const expandedTimestampLimit = expandTimestamp(
      Number(proposal.proposalInfo.proposalLimits.timestampLimit.toString())
    )
    const currentTimestamp = new Date().valueOf()

    return {
      value: format(expandedTimestampLimit, "MMM dd, y HH:mm"),
      completed: currentTimestamp - expandedTimestampLimit > 0,
    }
  }, [proposal])

  const investors = useMemo(() => {
    if (!proposal || !proposal?.totalInvestors) {
      return "0"
    }

    return proposal?.totalInvestors.toString()
  }, [proposal])

  const positionSize = useMemo(() => {
    if (!proposal || !proposal?.proposalInfo.balancePosition) {
      return "0"
    }

    return normalizeBigNumber(proposal.proposalInfo.balancePosition, 18, 6)
  }, [proposal])

  const traderSizePercentage = useMemo(() => {
    if (traderSizeLP.isZero()) {
      return BigNumber.from("0")
    }
    return percentageOfBignumbers(maxSizeLP, traderSizeLP)
  }, [maxSizeLP, traderSizeLP])

  const active = useMemo(() => {
    return !expirationDate.completed
  }, [expirationDate])

  const navigateToPool = useCallback(
    (e) => {
      e.stopPropagation()
      navigate(`/pool/profile/BASIC_POOL/${poolAddress}`)
    },
    [navigate, poolAddress]
  )
  const onInvest = () => {
    navigate(`/invest-risky-proposal/${poolAddress}/${proposalId}`)
  }

  useEffect(() => {
    if (!proposalPool || !account) {
      return
    }
    ;(async () => {
      const balance = await proposalPool?.balanceOf(account, proposalId)

      setYouSizeLP(balance)
    })()
  }, [account, proposalId, proposalPool])

  useEffect(() => {
    if (!proposalPool || !poolInfo || proposalId === undefined) {
      return
    }

    ;(async () => {
      const balance = await proposalPool.balanceOf(
        poolInfo.parameters.trader,
        proposalId
      )

      setTraderSizeLP(balance)
    })()
  }, [poolInfo, proposalId, proposalPool])

  const InvestButton = active ? (
    <Button full size="small" onClick={onInvest}>
      Stake LP
    </Button>
  ) : (
    <SecondaryButton full size="small">
      Stake LP
    </SecondaryButton>
  )

  return (
    <>
      <SharedS.Card>
        <SharedS.Head>
          <Flex>
            <TokenIcon address={proposal.proposalInfo.token} m="0" size={24} />
            <Flex ai="center">
              <SharedS.Title>{proposalSymbol}</SharedS.Title>
              <TraderRating rating={20} />
              <Flex m="0 0 -5px">
                <Tooltip id="risky-proposal-rating-info" size="small">
                  Risky proposal rating info
                </Tooltip>
              </Flex>
            </Flex>
          </Flex>
          <Flex onClick={navigateToPool}>
            <S.Ticker>{poolInfo?.ticker ?? ""}</S.Ticker>
            <TokenIcon
              address={poolInfo?.parameters.baseToken}
              m="0 0 0 4px"
              size={24}
            />
          </Flex>
        </SharedS.Head>
        <SharedS.Body>
          <BodyItem
            label="Proposal size  LP"
            amount={normalizeBigNumber(maxSizeLP, 18, 2)}
          />
          <BodyItem
            label="Your size LP"
            amount={normalizeBigNumber(BigNumber.from(youSizeLP), 18, 2)}
          />
          <BodyItem
            label="Fullness LP"
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
          <BodyItem label="Investors" amount={investors} symbol={"/ 1000"} />
          <BodyItem
            label={`Position size (${proposalSymbol})`}
            amount={positionSize}
          />
          <Flex full>{InvestButton}</Flex>
        </SharedS.Body>
        <S.Footer>
          <Flex>
            <S.FundIconContainer>
              <Icon
                size={24}
                m="0"
                source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
                address={poolAddress}
              />
            </S.FundIconContainer>
            <Flex dir="column" ai="flex-start" m="0 0 0 4px">
              <S.SizeTitle>
                Trader size: {normalizeBigNumber(traderSizeLP, 18, 6)} LP (
                {normalizeBigNumber(traderSizePercentage, 18, 2)}%)
              </S.SizeTitle>
              <S.LPSizeContainer>
                <TraderLPSize
                  size={Number(normalizeBigNumber(traderSizePercentage, 18, 2))}
                />
              </S.LPSizeContainer>
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
        </S.Footer>
      </SharedS.Card>
    </>
  )
}

export default RiskyProposalInvestorCard
