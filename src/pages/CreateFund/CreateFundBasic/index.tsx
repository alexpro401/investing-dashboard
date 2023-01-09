import React from "react"

import Header from "components/Header/Layout"
import CreateFundContextProvider from "context/fund/CreateFundContext"
import CreateFundForm from "forms/CreateFundForm"

import * as S from "../styled"

const CreateFundBasic: React.FC = () => {
  return (
    <S.Root isWithPaddings={true}>
      <Header>Create standard fund</Header>
      <S.PageHolder>
        <CreateFundContextProvider>
          <CreateFundForm presettedFundType="basic" />
        </CreateFundContextProvider>
      </S.PageHolder>
    </S.Root>
  )
}

export default CreateFundBasic
