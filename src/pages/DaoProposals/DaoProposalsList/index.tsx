import * as S from "./styled"

import { FC, HTMLAttributes, useMemo } from "react"
import { DaoProposalCard } from "common"
import { useGovPoolProposals } from "hooks/dao"
import Skeleton from "components/Skeleton"
import { useEffectOnce } from "react-use"
import { useParams } from "react-router-dom"
import { ProposalState, ProposalStatuses, proposalStatusToStates } from "types"

interface Props extends HTMLAttributes<HTMLDivElement> {
  status?: ProposalStatuses
}

const DaoProposalsList: FC<Props> = ({ status }) => {
  const { daoAddress } = useParams()

  const { proposalViews, loadProposals, isLoaded, isLoadFailed } =
    useGovPoolProposals(daoAddress!)

  console.log(proposalViews)

  const paginationOffset = 0
  const paginationPageLimit = 500

  useEffectOnce(() => {
    loadProposals(paginationOffset, paginationPageLimit)
  })

  const proposalsToShow = useMemo(() => {
    if (status) {
      return proposalViews.filter((el) =>
        proposalStatusToStates[status].includes(
          String(el.proposalState) as ProposalState
        )
      )
    } else {
      return proposalViews
    }
  }, [proposalViews, status])

  return (
    <>
      {isLoaded ? (
        isLoadFailed ? (
          <p>Oops... Something went wrong</p>
        ) : proposalsToShow.length ? (
          <S.DaoProposalsListBody>
            {proposalsToShow.map((proposalView, idx) => (
              <DaoProposalCard
                key={idx}
                proposalId={paginationOffset + idx + 1}
                proposalView={proposalView}
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
