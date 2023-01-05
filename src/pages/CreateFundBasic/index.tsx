import React from "react"

import Header from "components/Header/Layout"
import CreateFundContextProvider from "context/fund/CreateFundContext"
import CreateFundForm from "forms/CreateFundForm"

import * as S from "./styled"

const CreateFundBasic: React.FC = () => {
  return (
    <S.Root>
      <Header>Create standart fund</Header>
      <S.PageHolder>
        <S.PageContent>
          <CreateFundContextProvider>
            <CreateFundForm presettedFundType="basic" />
          </CreateFundContextProvider>
        </S.PageContent>
      </S.PageHolder>
    </S.Root>
  )
}

export default CreateFundBasic
