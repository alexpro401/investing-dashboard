import * as S from "./styled"

import {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { DaoProposalCard } from "common"
import { useGovPool, useGovPoolProposals } from "hooks/dao"
import Skeleton from "components/Skeleton"
import {
  ProposalState,
  ProposalStatuses,
  proposalStatusToStates,
  WrappedProposalView,
} from "types"
import { BigNumber } from "ethers"

interface Props extends HTMLAttributes<HTMLDivElement> {
  status?: ProposalStatuses
  govPoolAddress?: string
}

const DaoProposalsList: FC<Props> = ({ govPoolAddress, status }) => {
  const { pendingRewards } = useGovPool(govPoolAddress)

  const { wrappedProposalViews, isLoaded, isLoadFailed } =
    useGovPoolProposals(govPoolAddress)

  const [
    filteredProposalViewsWithRewards,
    setFilteredProposalViewsWithRewards,
  ] = useState<WrappedProposalView[]>([])

  const filteredWrappedProposalViews = useMemo(() => {
    if (status) {
      return wrappedProposalViews.filter((el) =>
        proposalStatusToStates[status].includes(
          String(el.proposalState) as ProposalState
        )
      )
    } else {
      return wrappedProposalViews
    }
  }, [wrappedProposalViews, status])

  const filterProposalViewsWithRewards = useCallback(async () => {
    for (const el of filteredWrappedProposalViews) {
      const rewards = await pendingRewards(Number(el.proposalId))

      if (BigNumber.isBigNumber(rewards) && rewards.gt(0)) {
        setFilteredProposalViewsWithRewards((prev) => [
          ...prev,
          { ...el, currentAccountRewards: rewards },
        ])
      }
    }
  }, [pendingRewards, filteredWrappedProposalViews])

  const proposalsViewsToShow = useMemo(() => {
    if (status === "completed-rewards") {
      return filteredProposalViewsWithRewards
    } else {
      return filteredWrappedProposalViews
    }
  }, [filteredProposalViewsWithRewards, filteredWrappedProposalViews, status])

  useEffect(() => {
    if (status === "completed-rewards") {
      filterProposalViewsWithRewards()
    }
  }, [filterProposalViewsWithRewards, status])

  return (
    <>
      {isLoaded ? (
        isLoadFailed ? (
          <p>Oops... Something went wrong</p>
        ) : proposalsViewsToShow.length ? (
          <S.DaoProposalsListBody>
            {proposalsViewsToShow.map((wrappedProposalView, idx) => (
              <DaoProposalCard
                key={idx}
                wrappedProposalView={wrappedProposalView}
                govPoolAddress={govPoolAddress}
              />
            ))}
          </S.DaoProposalsListBody>
        ) : (
          <p>{"There's no proposals, yet"}</p>
        )
      ) : (
        <>
          <Skeleton />
        </>
      )}
    </>
  )
}

export default DaoProposalsList
