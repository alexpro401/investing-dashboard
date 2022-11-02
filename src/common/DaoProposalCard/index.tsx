import * as S from "./styled"

import { FC, HTMLAttributes } from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalCard: FC<Props> = ({ ...rest }) => {
  return <S.Root {...rest}></S.Root>
}

export default DaoProposalCard
