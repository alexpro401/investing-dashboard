import * as S from "./styled"

import { FC, HTMLAttributes, useCallback } from "react"
import { DaoProposalCard } from "common"
import Header from "components/Header/Layout"
import { useNavigate, useParams } from "react-router-dom"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalsList: FC<Props> = () => {
  const { daoAddress, status } = useParams()

  const navigate = useNavigate()

  const redirectToFilteredDaoProposals = useCallback(
    (status: string) => {
      navigate(`/dao/${daoAddress}/proposals/${status}`)
    },
    [daoAddress, navigate]
  )

  return (
    <>
      <Header>All Proposals</Header>
      <S.Root>
        <S.DaoProposalsListHeader>
          <S.DaoProposalsListTab
            isActive={status === "open"}
            onClick={() => redirectToFilteredDaoProposals("open")}
          >
            Open voting
          </S.DaoProposalsListTab>
          <S.DaoProposalsListTab
            isActive={status === "ended"}
            onClick={() => redirectToFilteredDaoProposals("ended")}
          >
            Ended voting
          </S.DaoProposalsListTab>
          <S.DaoProposalsListTab
            isActive={status === "completed"}
            onClick={() => redirectToFilteredDaoProposals("completed")}
          >
            Completed
          </S.DaoProposalsListTab>
        </S.DaoProposalsListHeader>
        <S.DaoProposalsListBody>
          {[{}, {}, {}, {}, {}, {}, {}]?.map((el, idx) => (
            <DaoProposalCard key={idx} />
          ))}
        </S.DaoProposalsListBody>
      </S.Root>
    </>
  )
}

export default DaoProposalsList
