import * as S from "./styled"

import { FC, HTMLAttributes } from "react"
import Header from "components/Header/Layout"
import { Routes, Route, useParams } from "react-router-dom"
import DaoProposalsList from "pages/DaoProposals/DaoProposalsList"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposals: FC<Props> = () => {
  const { daoAddress } = useParams()

  const TABS = [
    {
      title: "Opened voting",
      source: `/dao/${daoAddress}/proposals/opened`,
    },
    {
      title: "Ended voting",
      source: `/dao/${daoAddress}/proposals/ended`,
    },
    {
      title: "Completed",
      source: `/dao/${daoAddress}/proposals/completed`,
    },
  ]

  return (
    <>
      <Header tabs={TABS}>All Proposals</Header>
      <S.Root>
        <Routes>
          <Route path="opened" element={<DaoProposalsList status="opened" />} />
          <Route path="ended" element={<DaoProposalsList status="ended" />} />
          <Route
            path="completed"
            element={<DaoProposalsList status="completed" />}
          />
        </Routes>
      </S.Root>
    </>
  )
}

export default DaoProposals
