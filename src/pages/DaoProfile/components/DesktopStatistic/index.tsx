import React, { useState, useCallback } from "react"
import { generatePath, useParams } from "react-router-dom"

import { ROUTE_PATHS } from "consts"
import ChooseDaoProposalAsPerson from "modals/ChooseDaoProposalAsPerson"
import { PoolStatisticsItem } from "pages/PoolProfile/components"

import * as S from "./styled"

const DesktopStatistic: React.FC = () => {
  const { daoAddress } = useParams()

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
          <PoolStatisticsItem
            label={"My votes"}
            value={"24,888"}
            percentage={"Votes"}
          />
          <PoolStatisticsItem
            label={"TVL"}
            value={`$24,888`}
            percentage={"+1.13%"}
          />
          <PoolStatisticsItem
            label={"APY"}
            value={"0.00%"}
            percentage={"-1.13%"}
          />
          <PoolStatisticsItem
            label={"APR"}
            value={"0.00%"}
            percentage={"-1.13%"}
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
