import * as S from "./styled"

import { FC, HTMLAttributes, useMemo } from "react"
import { DaoProposalCard } from "common"
import { useGovPoolProposals } from "hooks/dao"
import Skeleton from "components/Skeleton"
import { useParams } from "react-router-dom"
import { ProposalState, ProposalStatuses, proposalStatusToStates } from "types"

interface Props extends HTMLAttributes<HTMLDivElement> {
  status?: ProposalStatuses
}

const DaoProposalsList: FC<Props> = ({ status }) => {
  const { daoAddress } = useParams()

  const { wrappedProposalViews, isLoaded, isLoadFailed } =
    useGovPoolProposals(daoAddress)

  const proposalsToShow = useMemo(() => {
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

  return (
    <>
      {isLoaded ? (
        isLoadFailed ? (
          <p>Oops... Something went wrong</p>
        ) : proposalsToShow.length ? (
          <S.DaoProposalsListBody>
            {proposalsToShow.map((wrappedProposalView, idx) => (
              <DaoProposalCard
                key={idx}
                wrappedProposalView={wrappedProposalView}
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
