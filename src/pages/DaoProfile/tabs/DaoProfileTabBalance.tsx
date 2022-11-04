import * as React from "react"
import { v4 as uuidv4 } from "uuid"

import {
  DaoProfileEmptyBalanceCard,
  DaoProfileUserBalancesCard,
  DaoProfileValueWithActionCard,
} from "../components"
import { Indents, TextLabel } from "../styled"

import { Flex } from "theme"
import Tooltip from "components/Tooltip"

const DaoProfileTabBalance: React.FC = () => {
  return (
    <>
      <DaoProfileEmptyBalanceCard />
      <Indents top side={false}>
        <DaoProfileUserBalancesCard />
      </Indents>
      <Indents top side={false}>
        <DaoProfileValueWithActionCard
          value="$ 1000"
          info={
            <Flex ai="center" jc="flex-start" gap="4">
              <Tooltip id={uuidv4()}>Received rewards InFo</Tooltip>
              <TextLabel>Received rewards</TextLabel>
            </Flex>
          }
          onClick={() => alert("Handle claim")}
          actionText="Claim"
          count={8}
        />
      </Indents>
    </>
  )
}

export default DaoProfileTabBalance
