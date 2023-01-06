import { FC } from "react"

import * as S from "./styled"
import { Outlet } from "react-router-dom"

const GovPoolProposals: FC = () => {
  return (
    <S.OutletWrp>
      <Outlet />
    </S.OutletWrp>
  )
}

export default GovPoolProposals
