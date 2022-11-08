import * as S from "./styled"

import { FC, HTMLAttributes } from "react"
import { DaoProposalCard } from "common"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalsList: FC<Props> = () => {
  return (
    <>
      <S.DaoProposalsListBody>
        {[{}, {}, {}, {}, {}, {}, {}]?.map((el, idx) => (
          <DaoProposalCard key={idx} />
        ))}
      </S.DaoProposalsListBody>
    </>
  )
}

export default DaoProposalsList
