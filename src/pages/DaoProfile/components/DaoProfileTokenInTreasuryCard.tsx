import * as React from "react"
import { isNil } from "lodash"

import { Flex } from "theme"
import { Icon } from "common"
import { useBreakpoints } from "hooks"
import {
  TextValue,
  TreasuryAmountLabel,
  TreasuryDesktopTokenName,
  TreasuryDesktopExternalLink,
  SliderItem,
  FlexLink,
  NftIcon,
} from "../styled"

import TokenIcon from "components/TokenIcon"

import { ICON_NAMES } from "consts/icon-names"
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
  const { isBigTablet } = useBreakpoints()

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
        {!isBigTablet && (
          <>
            <FlexLink jc="flex-start" gap="8" as={"a"} href={explorerLink}>
              {type === "token" && (
                <TokenIcon address={address} size={38} m="0" />
              )}
              {type === "nft" && <NftIcon src={logo} alt="" />}
              <Flex dir="column" ai="flex-start" gap="4">
                <Flex ai="center" jc="flex-start" gap="4">
                  <TextValue fw={600} lh={"19px"}>
                    {symbol}
                  </TextValue>
                  <Icon name={ICON_NAMES.externalLink} color={"#788AB4"} />
                </Flex>
                <TreasuryAmountLabel>
                  {type === "token" ? "Token" : "NFT"}
                </TreasuryAmountLabel>
              </Flex>
            </FlexLink>
            <Flex dir="column" ai="flex-start" jc="center" gap="4">
              <TextValue fw={600}>${amountUsd}</TextValue>
              <TreasuryAmountLabel>{amount}</TreasuryAmountLabel>
            </Flex>
            <Flex
              dir="column"
              ai="flex-end"
              jc="center"
              style={{ height: "39px" }}
            >
              <TextValue fw={600}>{treasuryPercent}%</TextValue>
            </Flex>
          </>
        )}
        {isBigTablet && (
          <>
            <Flex jc="flex-start" gap="4">
              {type === "token" && (
                <TokenIcon address={address} size={24} m="0" />
              )}
              {type === "nft" && <NftIcon src={logo} alt="" />}
              <Flex dir="row" ai="center" gap="4">
                <TreasuryDesktopTokenName>{symbol}</TreasuryDesktopTokenName>
                <TreasuryDesktopExternalLink href={explorerLink}>
                  {symbol}
                </TreasuryDesktopExternalLink>
              </Flex>
            </Flex>
            <Flex ai="center" jc="flex-start">
              <TreasuryAmountLabel>{amount}</TreasuryAmountLabel>
            </Flex>
            <Flex ai="center" jc="center">
              <TreasuryAmountLabel>{amountUsd}</TreasuryAmountLabel>
            </Flex>
            <Flex ai="center" jc="flex-end" style={{ paddingRight: "8px" }}>
              <TreasuryAmountLabel>{treasuryPercent}%</TreasuryAmountLabel>
            </Flex>
          </>
        )}
      </SliderItem>
    </>
  )
}

export default DaoProfileTokenInTreasuryCard
