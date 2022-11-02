import * as S from "./styled"

import { FC, HTMLAttributes } from "react"
import { DaoProposalCard } from "common"
import Header from "components/Header/Layout"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalsList: FC<Props> = ({ ...rest }) => {
  return (
    <S.Root {...rest}>
      <Header>All Proposals</Header>
      <DaoProposalCard />
      <DaoProposalCard />
      <DaoProposalCard />
      <DaoProposalCard />
      <DaoProposalCard />
      <DaoProposalCard />
      <DaoProposalCard />
    </S.Root>
  )
}

export default DaoProposalsList
