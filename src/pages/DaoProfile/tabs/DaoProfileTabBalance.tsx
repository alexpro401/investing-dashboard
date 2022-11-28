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
import { useNavigate } from "react-router-dom"

interface Props {
  daoAddress?: string
}

const DaoProfileTabBalance: React.FC<Props> = ({ daoAddress }) => {
  const navigate = useNavigate()

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
          onClick={() => navigate(`/dao/${daoAddress}/claim/rewards`)}
          actionText="Claim"
          count={8}
        />
      </Indents>
      <Indents top side={false}>
        <DaoProfileValueWithActionCard
          value="10 proposals"
          info={<TextLabel>Voting history</TextLabel>}
          onClick={() => alert("Handle voting history")}
          actionText="Details"
        />
      </Indents>
    </>
  )
}

export default DaoProfileTabBalance
