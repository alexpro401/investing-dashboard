import { Routes, Route } from "react-router-dom"

import * as S from "./styled"

import { FundDetailsEdit, FundDetailsFee, FundDetailsMenu } from "./components"

import UpdateFundContext from "context/UpdateFundContext"
import { useBreakpoints } from "hooks"
import { useContext } from "react"
import { PoolProfileContext } from "../../context"

const FundDetails = () => {
  const {} = useContext(PoolProfileContext)

  const { isSmallTablet } = useBreakpoints()

  return (
    <S.Container>
      <S.Content>
        <Routes>
          <Route path="/" element={<FundDetailsMenu />} />
          <Route
            path="/edit"
            element={
              <UpdateFundContext>
                <FundDetailsEdit />
              </UpdateFundContext>
            }
          />
          <Route path="/fee" element={<FundDetailsFee />}></Route>
        </Routes>
      </S.Content>
    </S.Container>
  )
}

export default FundDetails
