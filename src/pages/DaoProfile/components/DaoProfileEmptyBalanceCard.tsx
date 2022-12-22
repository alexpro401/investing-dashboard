import { FC } from "react"
import { v4 as uuidv4 } from "uuid"

import { Flex } from "theme"
import { Card } from "common"
import { Divider, TextLabel, TextValue, FlexLink, AppLink } from "../styled"

import TokenIcon from "components/TokenIcon"
import { ICON_NAMES } from "constants/icon-names"

const DaoProfileEmptyBalanceCard: FC = () => {
  return (
    <Card>
      <FlexLink
        full
        ai="center"
        jc="space-between"
        as={"a"}
        href="https://ethereum.org/en/developers/docs/"
      >
        <Flex full ai="center" jc="flex-start" gap={"8"}>
          <TokenIcon key={uuidv4()} address={""} size={38} m="0" />
          <TextValue fw={600}>111PG...0x11...3437</TextValue>
        </Flex>
        {/* <AppLink
          iconRight={ICON_NAMES.externalLink}
          color="default"
          size="x-small"
          text="BscScan"
        /> */}
      </FlexLink>
      <Divider />
      <TextLabel fw={400}>
        To become a DAO member, buy the governance token via the following link.{" "}
      </TextLabel>
    </Card>
  )
}

export default DaoProfileEmptyBalanceCard
