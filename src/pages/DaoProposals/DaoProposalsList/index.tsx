import * as S from "./styled"

import { FC, HTMLAttributes } from "react"
import { DaoProposalCard } from "common"
import { useGovPoolProposals } from "hooks/dao"
import Skeleton from "components/Skeleton"
import { useEffectOnce } from "react-use"
import { useParams } from "react-router-dom"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalsList: FC<Props> = () => {
  const { daoAddress } = useParams()

  const { proposalViews, loadProposals, isLoaded, isLoadFailed } =
    useGovPoolProposals(daoAddress!)

  const paginationOffset = 0
  const paginationPageLimit = 500

  useEffectOnce(() => {
    loadProposals(paginationOffset, paginationPageLimit)
  })

  return (
    <>
      {isLoaded ? (
        isLoadFailed ? (
          <p>Oops... Something went wrong</p>
        ) : proposalViews.length ? (
          <S.DaoProposalsListBody>
            {proposalViews.map((proposalView, idx) => (
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
