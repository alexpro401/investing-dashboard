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

  useEffectOnce(() => {
    loadProposals()
  })

  return (
    <>
      {isLoaded ? (
        isLoadFailed ? (
          <p>Oops... Something went wrong</p>
        ) : (
          <S.DaoProposalsListBody>
            {proposalViews.map((proposalView, idx) => (
              <DaoProposalCard key={idx} proposalView={proposalView} />
            ))}
          </S.DaoProposalsListBody>
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
