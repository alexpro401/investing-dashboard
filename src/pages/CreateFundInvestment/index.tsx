import React from "react"

import Header from "components/Header/Layout"
import CreateFundContextProvider from "context/fund/CreateFundContext"
import CreateFundForm from "forms/CreateFundForm"

import * as S from "./styled"

const CreateFundInvestment: React.FC = () => {
  return (
    <S.Root>
      <Header>Create investment fund</Header>
      <S.PageHolder>
        <S.PageContent>
          <CreateFundContextProvider>
            <CreateFundForm presettedFundType="investment" />
          </CreateFundContextProvider>
        </S.PageContent>
      </S.PageHolder>
    </S.Root>
  )
}

export default CreateFundInvestment
