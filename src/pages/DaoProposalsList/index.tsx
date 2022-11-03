import * as S from "./styled"

import { FC, HTMLAttributes } from "react"
import { DaoProposalCard } from "common"
import Header from "components/Header/Layout"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalsList: FC<Props> = ({ ...rest }) => {
  return (
    <>
      <Header>All Proposals</Header>
      <S.DaoProposalsListBody>
        <DaoProposalCard />
        <DaoProposalCard />
        <DaoProposalCard />
        <DaoProposalCard />
        <DaoProposalCard />
        <DaoProposalCard />
        <DaoProposalCard />
      </S.DaoProposalsListBody>
    </>
  )
}

export default DaoProposalsList
