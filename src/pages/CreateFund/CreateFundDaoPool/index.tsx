import Header from "components/Header/Layout"
import CreateFundDaoForm from "forms/CreateFundDaoForm"
import GovPoolFormContextProvider from "context/govPool/GovPoolFormContext"

import { FC } from "react"

import * as S from "../styled"

const CreateFundDaoPool: FC = () => {
  return (
    <S.Root>
      <Header>Create DAO</Header>
      <S.PageHolder>
        <GovPoolFormContextProvider>
          <CreateFundDaoForm />
        </GovPoolFormContextProvider>
      </S.PageHolder>
    </S.Root>
  )
}

export default CreateFundDaoPool
