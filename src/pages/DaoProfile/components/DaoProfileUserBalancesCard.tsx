import { FC, useCallback, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import theme, { Flex } from "theme"
import { Card, Collapse, Icon } from "common"
import { TextLabel, TextValue } from "../styled"

import Button from "components/Button"
import Tooltip from "components/Tooltip"
import ProgressLine from "components/ProgressLine"
import { ICON_NAMES } from "constants/icon-names"

interface Props {}

const DaoProfileUserBalancesCard: FC<Props> = () => {
  const [showNftList, setShowNftList] = useState(false)
  const toggleNftList = useCallback(() => {
    setShowNftList((prev) => !prev)
  }, [])

  return (
    <Card>
      <Flex full ai="center" jc="space-between">
        <Flex dir="column" ai="flex-start" gap="4">
          <Flex ai="center" jc="flex-start" gap="4">
            <TextValue fw={600}>10 /</TextValue>
            <TextValue fw={600} color={theme.textColors.secondary}>
              8 DEXE
            </TextValue>
          </Flex>
          <Flex ai="center" gap="4">
            <Tooltip id={uuidv4()}>Total balance/used in voting</Tooltip>
            <TextLabel fw={500}>Total balance/used in voting</TextLabel>
          </Flex>
        </Flex>
        <Flex dir="column" ai="flex-end" gap="4">
          <TextValue fw={600} color={theme.statusColors.success}>
            2
          </TextValue>
          <TextLabel fw={500}>Available</TextLabel>
        </Flex>
      </Flex>
      <ProgressLine w={73} />
      <div>
        <Flex full ai="center" jc="space-between" onClick={toggleNftList}>
          <Flex dir="column" ai="flex-start" gap="4">
            <Flex ai="center" jc="flex-start" gap="4">
              <TextValue fw={600}>2 /</TextValue>
              <TextValue fw={600} color={theme.textColors.secondary}>
                1 NFT
              </TextValue>
              <Icon
                name={ICON_NAMES[showNftList ? "angleUp" : "angleDown"]}
                color={theme.textColors.secondary}
              />
            </Flex>
            <Flex>
              <TextLabel fw={500}>Total balance/used in voting</TextLabel>
            </Flex>
          </Flex>
          <Flex dir="column" ai="flex-end" gap="4">
            <TextValue fw={600} color={theme.statusColors.success}>
              1
            </TextValue>
            <TextLabel fw={500}>Available</TextLabel>
          </Flex>
        </Flex>
        <Collapse isOpen={showNftList} duration={0.3}>
          <div
            style={{
              padding: "8px",
              marginTop: "16px",
              background: "#20283A",
              borderRadius: "16px",
            }}
          >
            <Flex full ai="center" jc="space-between">
              <TextLabel fw={500}>#13 Voting Power: 100</TextLabel>
              <Flex ai="center" jc="flex-end" gap="8">
                <TextValue fw={600}>Available</TextValue>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "black",
                    borderRadius: "10px",
                  }}
                ></div>
              </Flex>
            </Flex>
          </div>
          <div
            style={{
              padding: "8px",
              marginTop: "8px",
              background: "#20283A",
              borderRadius: "16px",
            }}
          >
            <Flex full ai="center" jc="space-between">
              <TextLabel fw={500}>#13 Voting Power: 100</TextLabel>
              <Flex ai="center" jc="flex-end" gap="8">
                <TextValue fw={600}>Available</TextValue>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "black",
                    borderRadius: "10px",
                  }}
                ></div>
              </Flex>
            </Flex>
          </div>
        </Collapse>
      </div>
      <Button
        full
        fz={13}
        onClick={() => alert("Redirect to 'withdraw DAO tokens' terminal 🤑")}
      >
        Withdraw available assets
      </Button>
    </Card>
  )
}

export default DaoProfileUserBalancesCard
