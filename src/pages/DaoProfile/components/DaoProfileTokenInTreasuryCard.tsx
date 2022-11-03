import * as React from "react"

import { Flex } from "theme"
import { Icon } from "common"
import { TextLabel, TextValue, SliderItemToken, SliderItem } from "../styled"

import TokenIcon from "components/TokenIcon"

import { ICON_NAMES } from "constants/icon-names"
import { useERC20Data } from "state/erc20/hooks"
import { isNil } from "lodash"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import LockedIcon from "assets/icons/LockedIcon"

interface Props {
  token: any
  chainId?: number
}

const DaoProfileTokenInTreasuryCard: React.FC<Props> = ({ token, chainId }) => {
  const [tokenData] = useERC20Data(token.id)

  const explorerLink = React.useMemo(() => {
    if (isNil(token) || isNil(chainId)) return ""
    return getExplorerLink(chainId, token.id, ExplorerDataType.TOKEN)
  }, [token])

  if (!isNil(token.isFallback) && token.isFallback) {
    return <SliderItem />
  }

  return (
    <>
      <SliderItem>
        <SliderItemToken as={"a"} href={explorerLink}>
          <TokenIcon address={token.id} size={38} m="0" />
          <Flex dir="column" ai="flex-start" gap="4">
            <Flex ai="center" jc="flex-start" gap="4">
              <TextValue fw={600}>{tokenData?.symbol}</TextValue>
              <Icon name={ICON_NAMES.externalLink} color={"#788AB4"} />
            </Flex>
            <TextLabel fw={500}>{token.type}</TextLabel>
          </Flex>
        </SliderItemToken>
        <Flex dir="column" ai="flex-start" jc="center" gap="4">
          <TextValue fw={600}>${token.amountUsd}</TextValue>
          <TextLabel fw={500}>{token.amount}</TextLabel>
        </Flex>
        <Flex dir="column" ai="flex-end" jc="center" gap="4">
          <TextValue fw={600}>{token.inTreasury}%</TextValue>
          <Flex ai="flex-end" jc="flex-end" gap="1">
            {token.inVoting > 20 ? <LockedIcon /> : null}
            <TextLabel fw={500}>{token.inVoting} %</TextLabel>
          </Flex>
        </Flex>
      </SliderItem>
    </>
  )
}

export default DaoProfileTokenInTreasuryCard
