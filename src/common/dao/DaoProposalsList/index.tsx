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
import { isEqual } from "lodash"

interface Props extends HTMLAttributes<HTMLDivElement> {
  status?: ProposalStatuses
  govPoolAddress?: string
}

const DaoProposalsList: FC<Props> = ({ govPoolAddress, status }) => {
  const { pendingRewards } = useGovPool(govPoolAddress)

  const { wrappedProposalViews, isLoaded, isLoadFailed, loadProposals } =
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
    const proposalsWithRewards: WrappedProposalView[] = []

    for (const el of filteredWrappedProposalViews) {
      const rewards = await pendingRewards(Number(el.proposalId))

      if (status === "completed-all") {
        proposalsWithRewards.push({
          ...el,
          ...(BigNumber.isBigNumber(rewards) && rewards.gt(0)
            ? { currentAccountRewards: rewards }
            : {}),
        })
      } else if (
        status === "completed-rewards" &&
        BigNumber.isBigNumber(rewards) &&
        rewards.gt(0)
      ) {
        proposalsWithRewards.push({
          ...el,
          currentAccountRewards: rewards,
        })
      }
    }

    setFilteredProposalViewsWithRewards((prev) => {
      const next = proposalsWithRewards

      return isEqual(prev, next) ? prev : next
    })
  }, [filteredWrappedProposalViews, pendingRewards, status])

  const proposalsViewsToShow = useMemo(() => {
    if (status === "completed-rewards" || status === "completed-all") {
      return filteredProposalViewsWithRewards
    } else {
      return filteredWrappedProposalViews
    }
  }, [filteredProposalViewsWithRewards, filteredWrappedProposalViews, status])

  useEffect(() => {
    if (status === "completed-rewards" || status === "completed-all") {
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
                onButtonClick={loadProposals}
              />
            ))}
          </S.DaoProposalsListBody>
        ) : (
          <p>{"There's no proposals, yet"}</p>
        )
      ) : (
        <>
          <S.DaoProposalsListBody>
            <Skeleton w="100%" h="225px" />
            <Skeleton w="100%" h="225px" />
            <Skeleton w="100%" h="225px" />
          </S.DaoProposalsListBody>
        </>
      )}
    </>
  )
}

export default DaoProposalsList
