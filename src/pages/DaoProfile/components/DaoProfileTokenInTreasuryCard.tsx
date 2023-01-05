import * as React from "react"

import { Flex } from "theme"
import { Icon } from "common"
import { TextLabel, TextValue, SliderItem, FlexLink, NftIcon } from "../styled"

import TokenIcon from "components/TokenIcon"

import { ICON_NAMES } from "consts/icon-names"
import { isNil } from "lodash"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

interface Props {
  type: "token" | "nft"
  address: string
  amountUsd: string
  amount: string
  chainId?: number
  logo: string
  symbol: string
  treasuryPercent: string
  isFallback: boolean
}

const DaoProfileTokenInTreasuryCard: React.FC<Props> = ({
  type,
  address,
  amount,
  amountUsd,
  chainId,
  logo,
  symbol,
  treasuryPercent,
  isFallback,
}) => {
  const explorerLink = React.useMemo(() => {
    if (isNil(address) || isNil(chainId)) return ""
    return getExplorerLink(chainId, address, ExplorerDataType.TOKEN)
  }, [address, chainId])

  if (!isNil(isFallback) && isFallback) {
    return <SliderItem />
  }

  return (
    <>
      <SliderItem>
        <FlexLink jc="flex-start" gap="8" as={"a"} href={explorerLink}>
          {type === "token" && <TokenIcon address={address} size={38} m="0" />}
          {type === "nft" && <NftIcon src={logo} alt="" />}
          <Flex dir="column" ai="flex-start" gap="4">
            <Flex ai="center" jc="flex-start" gap="4">
              <TextValue fw={600} lh={"19px"}>
                {symbol}
              </TextValue>
              <Icon name={ICON_NAMES.externalLink} color={"#788AB4"} />
            </Flex>
            <TextLabel fw={500}>{type === "token" ? "Token" : "NFT"}</TextLabel>
          </Flex>
        </FlexLink>
        <Flex dir="column" ai="flex-start" jc="center" gap="4">
          <TextValue fw={600}>${amountUsd}</TextValue>
          <TextLabel fw={500} lh={"19px"}>
            {amount}
          </TextLabel>
        </Flex>
        <Flex dir="column" ai="flex-end" jc="flex-start">
          <TextValue fw={600}>{treasuryPercent}%</TextValue>
        </Flex>
      </SliderItem>
    </>
  )
}

export default DaoProfileTokenInTreasuryCard
