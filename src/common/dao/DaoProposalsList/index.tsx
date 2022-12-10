import * as S from "./styled"

import {
  FC,
  HTMLAttributes,
  ReactNode,
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

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  status?: ProposalStatuses
  govPoolAddress?: string
  children?: (props) => ReactNode
}

const DaoProposalsList: FC<Props> = ({ govPoolAddress, status, children }) => {
  const [isListPrepared, setIsListPrepared] = useState(
    !status || (status !== "completed-all" && status !== "completed-rewards")
  )
  const { pendingRewards, distributionProposalAddress } =
    useGovPool(govPoolAddress)

  const { wrappedProposalViews, isLoaded, isLoadFailed, loadProposals } =
    useGovPoolProposals(govPoolAddress)

  const [
    filteredProposalViewsWithRewards,
    setFilteredProposalViewsWithRewards,
  ] = useState<WrappedProposalView[]>([{} as WrappedProposalView])
  const [
    filteredProposalViewsDistribution,
    setFilteredProposalViewsDistribution,
  ] = useState<WrappedProposalView[]>([])
  const [filteredProposalViewsInsurance, setFilteredProposalViewsInsurance] =
    useState<WrappedProposalView[]>([])

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

  const filterProposalViewsDistribution = useCallback(async () => {
    const proposalsDistribution: WrappedProposalView[] = []

    for (const el of filteredWrappedProposalViews) {
      const rewards = await pendingRewards(Number(el.proposalId))

      const lastExecutor = String(
        el?.proposal?.executors[el?.proposal?.executors.length - 1]
      ).toLocaleLowerCase()

      if (
        lastExecutor ===
          String(distributionProposalAddress).toLocaleLowerCase() &&
        BigNumber.isBigNumber(rewards) &&
        rewards.gt(0)
      ) {
        proposalsDistribution.push({
          ...el,
          currentAccountRewards: rewards,
        })
      }
    }

    setFilteredProposalViewsDistribution((prev) => {
      const next = proposalsDistribution

      return isEqual(prev, next) ? prev : next
    })
  }, [filteredWrappedProposalViews, status, distributionProposalAddress])

  const filterProposalViewsInsurance = useCallback(async () => {
    const proposalsInsurance: WrappedProposalView[] = []

    for (const el of filteredWrappedProposalViews) {
      const lastExecutor = String(
        el?.proposal?.executors[el?.proposal?.executors.length - 1]
      ).toLocaleLowerCase()

      if (
        lastExecutor ===
        String(process.env.REACT_APP_DEXE_DAO_ADDRESS).toLocaleLowerCase()
      ) {
        proposalsInsurance.push(el)
      }
    }

    setFilteredProposalViewsInsurance((prev) => {
      const next = proposalsInsurance

      return isEqual(prev, next) ? prev : next
    })
  }, [filteredWrappedProposalViews, status, distributionProposalAddress])

  const proposalsViewsToShow = useMemo(() => {
    if (status === "completed-rewards" || status === "completed-all") {
      return filteredProposalViewsWithRewards
    } else if (status === "completed-distribution") {
      return filteredProposalViewsDistribution
    } else if (status === "opened-insurance") {
      return filteredProposalViewsInsurance
    } else {
      return filteredWrappedProposalViews
    }
  }, [
    filteredProposalViewsWithRewards,
    filteredProposalViewsDistribution,
    filteredProposalViewsInsurance,
    filteredWrappedProposalViews,
    status,
  ])

  useEffect(() => {
    if (status === "completed-rewards" || status === "completed-all") {
      filterProposalViewsWithRewards()
    } else if (status === "completed-distribution") {
      filterProposalViewsDistribution()
    } else if (status === "opened-insurance") {
      filterProposalViewsInsurance()
    }
  }, [filterProposalViewsWithRewards, status])

  useEffect(() => {
    setIsListPrepared(true)
  }, [filterProposalViewsWithRewards])

  return (
    <>
      {isLoaded && isListPrepared ? (
        isLoadFailed ? (
          <p>Oops... Something went wrong</p>
        ) : proposalsViewsToShow.length ? (
          <>
            <S.DaoProposalsListBody>
              {proposalsViewsToShow.map((wrappedProposalView, idx) => (
                <DaoProposalCard
                  key={idx}
                  wrappedProposalView={wrappedProposalView}
                  govPoolAddress={govPoolAddress}
                  onButtonClick={loadProposals}
                  completed={
                    status === "completed-rewards" || status === "completed-all"
                  }
                />
              ))}
            </S.DaoProposalsListBody>
            {!!children &&
              children({ proposalsViewsToShow, status, loadProposals })}
          </>
        ) : (
          <S.EmptyMessage message="There's no proposals, yet" />
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
