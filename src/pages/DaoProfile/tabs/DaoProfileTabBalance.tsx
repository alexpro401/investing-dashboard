import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { formatEther } from "@ethersproject/units"

import {
  DaoProfileEmptyBalanceCard,
  DaoProfileUserBalancesCard,
  DaoProfileValueWithActionCard,
} from "../components"
import { Indents, TextLabel } from "../styled"
import TabFallback from "./TabFallback"

import { Flex } from "theme"
import Tooltip from "components/Tooltip"
import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"
import { formatFiatNumber } from "utils"

interface Props {
  daoAddress?: string
}

const DaoProfileTabBalance: React.FC<Props> = ({ daoAddress }) => {
  const navigate = useNavigate()
  const {
    myProposalsCount,
    receivedRewardsUSD,
    unclaimedProposalsCount,
    myBalanceLoading,
  } = useContext(GovPoolProfileTabsContext)

  if (myBalanceLoading) {
    return <TabFallback />
  }

  return (
    <>
      <DaoProfileEmptyBalanceCard />
      <Indents top side={false}>
        <DaoProfileUserBalancesCard />
      </Indents>
      <Indents top side={false}>
        {receivedRewardsUSD && (
          <DaoProfileValueWithActionCard
            value={`$ ${formatFiatNumber(formatEther(receivedRewardsUSD))}`}
            info={
              <Flex ai="center" jc="flex-start" gap="4">
                <Tooltip id={uuidv4()}>Received rewards InFo</Tooltip>
                <TextLabel>Received rewards</TextLabel>
              </Flex>
            }
            onClick={() => navigate(`/dao/${daoAddress}/claim/rewards`)}
            actionText="Claim"
            count={unclaimedProposalsCount ?? null}
          />
        )}
      </Indents>
      <Indents top side={false}>
        <DaoProfileValueWithActionCard
          value={`${myProposalsCount ?? 0} proposals`}
          info={<TextLabel>Voting history</TextLabel>}
          onClick={() => alert("Handle voting history")}
          actionText="Details"
        />
      </Indents>
    </>
  )
}

export default DaoProfileTabBalance
