import { useCallback, useEffect, useMemo, useState } from "react"
import { ethers } from "ethers"
import { useSelector } from "react-redux"
import { AnimatePresence } from "framer-motion"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"

import { PriceFeed } from "abi"
import { IInvestorProposal } from "constants/interfaces_v2"
import useContract, { useERC20 } from "hooks/useContract"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { selectPriceFeedAddress } from "state/contracts/selectors"
import { usePoolContract } from "hooks/usePool"
import { normalizeBigNumber } from "utils"
import { percentageOfBignumbers } from "utils/formulas"

import { Flex } from "theme"
import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import AmountRow from "components/Amount/Row"
import PositionTrade from "components/PositionTrade"

import { accordionSummaryVariants } from "motion/variants"
import SharedS, { BodyItem, Actions } from "components/cards/position/styled"
import S from "./styled"

interface Props {
  position: IInvestorProposal
}

const InvestPositionCard: React.FC<Props> = ({ position }) => {
  const [, poolInfo] = usePoolContract(position.pool.id)
  const [, baseTokenData] = useERC20(position.pool.token)
  const priceFeedAddress = useSelector(selectPriceFeedAddress)
  const priceFeed = useContract(priceFeedAddress, PriceFeed)

  const [{ poolMetadata }] = usePoolMetadata(
    position.pool.id,
    poolInfo?.parameters.descriptionURL
  )

  const [markPriceOpen, setMarkPriceOpenOpen] = useState(BigNumber.from(0))
  const markPriceOpenUSD = useTokenPriceOutUSD({
    tokenAddress: position.pool.token,
  })

  const [showExtra, setShowExtra] = useState<boolean>(false)
  const [showPositions, setShowPositions] = useState<boolean>(false)
  const [showComission, setShowComission] = useState<boolean>(false)
  const toggleExtraContent = useCallback(() => {
    if (position.isClosed) {
      setShowPositions(!showPositions)
    } else {
      if (showPositions) {
        setShowPositions(false)
      }
      if (showComission) {
        setShowComission(false)
      }
    }
    setShowExtra(!showExtra)
  }, [showExtra, position.isClosed, showComission, showPositions])

  const togglePositions = useCallback(() => {
    if (!showPositions && showComission) {
      setShowComission(false)
    }
    setShowPositions(!showPositions)
  }, [showComission, showPositions])

  const toggleComission = useCallback(() => {
    if (!showComission && showPositions) {
      setShowPositions(false)
    }
    setShowComission(!showComission)
  }, [showComission, showPositions])

  const baseTokenSymbol = useMemo<string>(() => {
    if (!baseTokenData || !baseTokenData.symbol) {
      return ""
    }
    return baseTokenData.symbol
  }, [baseTokenData])

  const positionOpenLPAmount = useMemo<string>(() => {
    if (!position.totalLPInvestVolume || !position.totalLPDivestVolume) {
      return "0"
    }

    if (position.isClosed) {
      return normalizeBigNumber(position.totalLPInvestVolume, 18, 6)
    } else {
      const investFixed = FixedNumber.fromValue(
        position.totalLPInvestVolume,
        18
      )
      const divestFixed = FixedNumber.fromValue(
        position.totalLPDivestVolume,
        18
      )
      const res = investFixed.subUnsafe(divestFixed)

      return normalizeBigNumber(ethers.utils.parseEther(res._value), 18, 6)
    }
  }, [position])

  const entryPriceBase = useMemo<BigNumber>(() => {
    if (
      !position ||
      !position.totalUSDInvestVolume ||
      !position.totalLPInvestVolume
    ) {
      return BigNumber.from("0")
    }

    const totalUsdInvestFixed = FixedNumber.fromValue(
      position.totalUSDInvestVolume,
      18
    )
    const totalLpInvestFixed = FixedNumber.fromValue(
      position.totalLPInvestVolume,
      18
    )
    const resFixed = totalUsdInvestFixed.divUnsafe(totalLpInvestFixed)

    return ethers.utils.parseEther(resFixed._value)
  }, [position])

  const entryPriceUSD = useMemo<BigNumber>(() => {
    if (
      !position ||
      !position.totalBaseInvestVolume ||
      !position.totalLPInvestVolume
    ) {
      return BigNumber.from("0")
    }

    const totalBaseInvestFixed = FixedNumber.fromValue(
      position.totalBaseInvestVolume,
      18
    )
    const totalLpInvestFixed = FixedNumber.fromValue(
      position.totalLPInvestVolume,
      18
    )
    const resFixed = totalBaseInvestFixed.divUnsafe(totalLpInvestFixed)

    return ethers.utils.parseEther(resFixed._value)
  }, [position])

  const markPrice = useMemo(() => {
    if (!position) {
      return BigNumber.from("0")
    }

    if (position.isClosed) {
      const totalBaseDivestVolumeFixed = FixedNumber.fromValue(
        position.totalBaseDivestVolume,
        18
      )
      const totalLPInvestVolumeFixed = FixedNumber.fromValue(
        position.totalLPInvestVolume,
        18
      )
      const resFixed = totalBaseDivestVolumeFixed.divUnsafe(
        totalLPInvestVolumeFixed
      )

      return ethers.utils.parseEther(resFixed._value)
    }

    return markPriceOpen
  }, [markPriceOpen, position])

  const markPriceUSD = useMemo(() => {
    if (!position) {
      return BigNumber.from("0")
    }

    if (position.isClosed) {
      const totalUSDDivestVolumeFixed = FixedNumber.fromValue(
        position.totalUSDDivestVolume,
        18
      )
      const totalLPInvestVolumeFixed = FixedNumber.fromValue(
        position.totalLPInvestVolume,
        18
      )
      const resFixed = totalUSDDivestVolumeFixed.divUnsafe(
        totalLPInvestVolumeFixed
      )

      return ethers.utils.parseEther(resFixed._value)
    }

    return markPriceOpenUSD
  }, [markPriceOpenUSD, position])

  const pnlBase = useMemo(() => {
    if (!position) {
      return BigNumber.from("0")
    }

    if (position.isClosed) {
      // totalBaseDivestVolume - totalBaseInvestVolume
      const totalBaseDivestVolumeFixed = FixedNumber.fromValue(
        position.totalBaseDivestVolume,
        18
      )
      const totalBaseInvestVolumeFixed = FixedNumber.fromValue(
        position.totalBaseInvestVolume,
        18
      )

      const resFixed = totalBaseDivestVolumeFixed.subUnsafe(
        totalBaseInvestVolumeFixed
      )
      return ethers.utils.parseEther(resFixed._value)
    } else {
      // totalBaseDivestVolume + (traderPool.getUsersInfo(address, 0, 0)[0].poolBaseShare) -totalBaseInvestVolume
      return BigNumber.from("0")
    }
  }, [position])

  const pnlPercentage = useMemo(() => {
    // if (!markPriceOpen || !entryPriceBase) return BigNumber.from("0")

    // const percentage = percentageOfBignumbers(markPriceOpen, entryPriceBase)

    // const resultFixed = FixedNumber.fromValue(percentage, 18).subUnsafe(
    //   FixedNumber.from("100", 18)
    // )

    // return ethers.utils.parseEther(resultFixed._value)
    return BigNumber.from("0")
  }, [markPriceOpen, entryPriceBase])

  const pnlUSD = useMemo(() => {
    if (!position) {
      return BigNumber.from("0")
    }

    if (position.isClosed) {
      const totalUSDDivestVolumeFixed = FixedNumber.fromValue(
        position.totalUSDDivestVolume,
        18
      )
      const totalUSDInvestVolumeFixed = FixedNumber.fromValue(
        position.totalUSDInvestVolume,
        18
      )

      const resFixed = totalUSDDivestVolumeFixed.subUnsafe(
        totalUSDInvestVolumeFixed
      )
      return ethers.utils.parseEther(resFixed._value)
    } else {
      // totalUSDDivestVolume + (traderPool.getUsersInfo(address, 0, 0)[0].poolUSDShare) - totalUSDInvestVolume
      return BigNumber.from("0")
    }
  }, [position])

  // Commission data
  const commissionPercentage = useMemo(() => {
    if (!poolInfo) return "0"

    return normalizeBigNumber(poolInfo.parameters.commissionPercentage, 25, 0)
  }, [poolInfo])

  const commissionPeriod = useMemo(() => {
    if (!poolInfo || !poolInfo.parameters) {
      return ""
    }

    switch (poolInfo.parameters.commissionPeriod) {
      case 0:
        return "1"
      case 1:
        return "3"
      case 2:
        return "12"
      default:
        return ""
    }
  }, [poolInfo])

  // get mark price
  useEffect(() => {
    if (!priceFeed) return

    const getmarkPriceOpen = async () => {
      const amount = ethers.utils.parseUnits("1", 18)

      // without extended
      const price = await priceFeed.getNormalizedExtendedPriceOut(
        position.pool.token,
        baseTokenData?.address,
        amount,
        []
      )
      setMarkPriceOpenOpen(price.amountOut)
    }

    getmarkPriceOpen().catch(console.error)
  }, [priceFeed, baseTokenData, position.pool.token])

  const onBuyMore = (e) => {
    e.preventDefault()
    console.log("onBuyMore")
  }

  const onClosePosition = (e) => {
    e.preventDefault()
    console.log("onClosePosition")
  }

  const actions = [
    {
      label: "All trades",
      active: showPositions,
      onClick: togglePositions,
    },
    {
      label: "Buy more",
      onClick: onBuyMore,
    },
    {
      label: "Comission",
      active: showComission,
      onClick: toggleComission,
    },
    {
      label: "Close",
      onClick: onClosePosition,
    },
  ]

  return (
    <>
      <SharedS.Container>
        <SharedS.Card onClick={toggleExtraContent}>
          <SharedS.Head>
            <Flex>
              <Icon
                m="0"
                size={24}
                source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
                address={position.pool.id}
              />
              <S.Amount>{positionOpenLPAmount}</S.Amount>
              <S.PositionSymbol>{poolInfo?.ticker}</S.PositionSymbol>
            </Flex>
            <Flex>
              <S.FundSymbol>{baseTokenData?.symbol}</S.FundSymbol>
              <TokenIcon address={baseTokenData?.address} m="0" size={24} />
            </Flex>
          </SharedS.Head>

          <SharedS.Body>
            <BodyItem
              label={"Entry Price " + baseTokenSymbol}
              amount={entryPriceBase}
              amountUSD={entryPriceUSD}
            />
            <BodyItem
              label={
                (position.isClosed ? "Closed price " : "Current price ") +
                baseTokenSymbol
              }
              amount={markPrice}
              amountUSD={markPriceUSD}
            />
            <BodyItem
              label={`P&L ${baseTokenSymbol}`}
              amount={pnlBase}
              pnl={pnlPercentage}
              amountUSD={pnlUSD}
              ai="flex-end"
            />
          </SharedS.Body>
        </SharedS.Card>

        <AnimatePresence>
          {!position.isClosed && (
            <Actions actions={actions} visible={showExtra} />
          )}
        </AnimatePresence>

        <SharedS.ExtraItem
          initial="hidden"
          animate={showPositions ? "visible" : "hidden"}
          variants={accordionSummaryVariants}
        >
          {position.vest && position.vest.length > 0 ? (
            position.vest.map((v) => (
              <PositionTrade
                key={v.id}
                id={v.id}
                isBuy={v.isInvest}
                timestamp={v.timestamp}
                amount={v.volumeBase}
                priceBase={v.volumeLP}
                priceUsd={v.volumeUSD}
                baseTokenSymbol={baseTokenData?.symbol}
                data={v}
              />
            ))
          ) : (
            <>No vests</>
          )}
        </SharedS.ExtraItem>
        <SharedS.ExtraItem
          initial="hidden"
          animate={showComission ? "visible" : "hidden"}
          variants={accordionSummaryVariants}
          p="16px"
        >
          <AmountRow
            title={`${commissionPeriod} month Performance Fee`}
            value={`${commissionPercentage}%`}
          />
          <AmountRow m="14px 0 0" title="Performance Fee" value="$22k" />
          <AmountRow
            m="14px 0 0"
            title="Date of withdrawal"
            value="12.12.2021"
          />
          <AmountRow
            m="14px 0 0"
            title="Investor funds locked (3%)"
            value="$133k/$3.333.333"
          />
        </SharedS.ExtraItem>
      </SharedS.Container>
    </>
  )
}

export default InvestPositionCard
