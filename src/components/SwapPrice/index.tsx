import { useState, useEffect, useCallback, ReactNode } from "react"
import { Flex } from "theme"
import { BigNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { formatNumber } from "utils"

import angle from "assets/icons/angle-down.svg"
import gas from "assets/icons/gas-price.svg"

import {
  Container,
  Card,
  Content,
  WhiteText,
  TokenPrice,
  UsdPrice,
  GasPrice,
  GasIcon,
  AngleIcon,
} from "./styled"
import { dropdownVariants, rotate180Variants } from "motion/variants"

interface Props {
  fromSymbol?: string
  toSymbol?: string
  tokensCost?: BigNumber
  usdCost?: BigNumber
  gasPrice: string
  isExpandable?: boolean
  children?: ReactNode
}

const SwapPrice: React.FC<Props> = ({
  fromSymbol,
  toSymbol,
  tokensCost,
  usdCost,
  gasPrice,
  children,
  isExpandable = false,
}) => {
  const [loading, setLoading] = useState(true)
  const [isExpanded, setExpanded] = useState(false)

  const handleAngleClick = useCallback(() => {
    if (isExpandable) {
      setExpanded(!isExpanded)
    }
  }, [isExpandable, isExpanded])

  useEffect(() => {
    if (!fromSymbol && !toSymbol) {
      setLoading(true)
      return
    }
    setLoading(false)
  }, [fromSymbol, toSymbol])

  const variants = {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  }

  const icon = (
    <AngleIcon
      variants={rotate180Variants}
      animate={isExpanded ? "hidden" : "visible"}
      src={angle}
    />
  )

  const loaderContent = (
    <>
      <Card>
        <Flex ai="center">
          <WhiteText>Fetching best price...</WhiteText>
        </Flex>
      </Card>
    </>
  )

  const mainContent = (
    <>
      <Card onClick={handleAngleClick}>
        <Flex ai="center">
          <TokenPrice>
            1 {toSymbol} ={" "}
            {tokensCost && formatNumber(formatUnits(tokensCost), 6)}{" "}
            {fromSymbol}
          </TokenPrice>
          {usdCost && (
            <UsdPrice>(${formatNumber(formatUnits(usdCost), 2)})</UsdPrice>
          )}
        </Flex>
        <Flex gap="6" ai="center">
          <GasIcon src={gas} />
          <GasPrice>${gasPrice}</GasPrice>
          {isExpandable && (
            <Flex
              initial="hidden"
              animate={loading ? "hidden" : "visible"}
              variants={variants}
              ai="center"
            >
              {icon}
            </Flex>
          )}
        </Flex>
      </Card>
      <Content
        initial="hidden"
        animate={isExpanded ? "visible" : "hidden"}
        variants={dropdownVariants}
      >
        {children}
      </Content>
    </>
  )

  return <Container>{loading ? loaderContent : mainContent}</Container>
}

export default SwapPrice
