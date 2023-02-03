import React, { useState, useCallback, useContext } from "react"
import { generatePath, useParams } from "react-router-dom"
import { formatUnits } from "@ethersproject/units"

import { ROUTE_PATHS } from "consts"
import ChooseDaoProposalAsPerson from "modals/ChooseDaoProposalAsPerson"
import { PoolStatisticsItem } from "pages/PoolProfile/components"
import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"
import { formatNumber } from "utils"

import * as S from "./styled"

const DesktopStatistic: React.FC = () => {
  const { daoAddress } = useParams()
  const { myVotingPower } = useContext(GovPoolProfileTabsContext)

  const [createProposalModalOpened, setCreateProposalModalOpened] =
    useState<boolean>(false)

  const handleOpenCreateProposalModal = useCallback(() => {
    setCreateProposalModalOpened(true)
  }, [])

  const handleCloseCreateProposalModal = useCallback(() => {
    setCreateProposalModalOpened(false)
  }, [])

  return (
    <>
      <S.Root>
        <S.Statistics>
          <S.PoolStatisticsItemMyVotes
            label={"My votes"}
            value={`${
              myVotingPower
                ? formatNumber(formatUnits(myVotingPower, 18), 3)
                : ""
            }`}
            percentageLabel={"Votes"}
            tooltipMsg={"My votes tooltip ( TODO )"}
          />
          <PoolStatisticsItem
            label={"TVL"}
            value={"$0.000"}
            percentage={1.13}
            tooltipMsg={"TVL tooltip ( TODO )"}
          />
          <PoolStatisticsItem
            label={"APY"}
            value={"0.00%"}
            percentage={-1.13}
            tooltipMsg={"APY tooltip ( TODO )"}
          />
          <PoolStatisticsItem
            label={"APR"}
            value={"0.00%"}
            percentage={-1.13}
            tooltipMsg={"APR tooltip ( TODO )"}
          />
        </S.Statistics>
        <S.Actions>
          <S.ActionButton
            text="All proposals"
            color="tertiary"
            routePath={generatePath(ROUTE_PATHS.daoProposalList, {
              daoAddress: daoAddress ?? "",
              "*": "",
            })}
          />
          <S.ActionButtonSecondary
            text="Create new"
            color="secondary"
            onClick={handleOpenCreateProposalModal}
          />
        </S.Actions>
      </S.Root>
      <ChooseDaoProposalAsPerson
        isOpen={createProposalModalOpened}
        daoAddress={daoAddress ?? ""}
        toggle={handleCloseCreateProposalModal}
      />
    </>
  )
}

export default DesktopStatistic
